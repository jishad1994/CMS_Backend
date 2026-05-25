import { ERROR_MESSAGES } from "../../constants/erro.messages.constants";
import { HTTP_MESSAGES } from "../../constants/http.messages.contants";
import { LoginDto, RegisterDto } from "../../dtos/auth.dto";
import { AppError } from "../../errors/app.error";
import { ICacheService } from "../../infrastructure/cacheService/ICacheService";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.util";
import { comparePassword, hashPassword } from "../../utils/password.util";
import { IAuthService } from "./auth.service.interface";

export class AuthService implements IAuthService {
    constructor(private readonly userRepository: IUserRepository, private readonly cacheService: ICacheService) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.userRepository.findByEmail(dto.email);

        if (existingUser) {
            throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED, 409);
        }

        const hashedPassword = await hashPassword(dto.password);

        const user = await this.userRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });

        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
        });

        //Generate new  session ID
        const sessionId = crypto.randomUUID();

        const refreshToken = generateRefreshToken({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            sessionId,
        });

        const refreshTokenExpiryInSeconds = 7 * 24 * 60 * 60;

        await this.cacheService.set(
            sessionId,
            {
                userId: user._id.toString(),
                email: user.email,
                sessionId,
                createdAt: new Date().toISOString(),
            },
            refreshTokenExpiryInSeconds,
        );

        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.userRepository.findByEmail(dto.email, true);

        if (!user) {
            throw new AppError(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD, 401);
        }

        const passwordMatched = await comparePassword(dto.password, user.password);

        if (!passwordMatched) {
            throw new AppError(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD, 401);
        }

        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
        });

        //Generate new  session ID
        const sessionId = crypto.randomUUID();

        const refreshToken = generateRefreshToken({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            sessionId,
        });
        const refreshTokenExpiryInSeconds = 7 * 24 * 60 * 60;

        await this.cacheService.set(
            sessionId,
            {
                userId: user._id.toString(),
                email: user.email,
                sessionId,
                createdAt: new Date().toISOString(),
            },
            refreshTokenExpiryInSeconds,
        );

        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    }

    async refresh(oldRefreshToken: string) {
        const payload = verifyRefreshToken(oldRefreshToken);

        const oldSession = await this.cacheService.get(payload.sessionId);

        if (!oldSession) {
            throw new AppError(HTTP_MESSAGES.INVALID_SESSION_DATA, 401);
        }

        await this.cacheService.delete(payload.sessionId);

        const newSessionId = crypto.randomUUID();

        const newAccessToken = generateAccessToken({
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
        });

        const newRefreshToken = generateRefreshToken({
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
            sessionId: newSessionId,
        });

        const refreshTokenExpiryInSeconds = 7 * 24 * 60 * 60;

        await this.cacheService.set(
            newSessionId,
            {
                userId: payload.userId,
                email: payload.email,
                sessionId: newSessionId,
                createdAt: new Date().toISOString(),
            },
            refreshTokenExpiryInSeconds,
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: payload.userId,
                name: payload.name,
                email: payload.email,
            },
        };
    }
}
