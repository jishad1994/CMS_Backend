import { ERROR_MESSAGES } from "../../constants/erro.messages.constants";
import { LoginDto, RegisterDto } from "../../dtos/auth.dto";
import { AppError } from "../../errors/app.error";
import { IUserRepository } from "../../repositories/interfaces/user.repository.interface";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.util";
import { comparePassword, hashPassword } from "../../utils/password.util";
import { IAuthService } from "./auth.service.interface";

export class AuthService implements IAuthService {
    constructor(private readonly userRepository: IUserRepository) {}

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
            email: user.email,
        });
        const refreshToken = generateRefreshToken({
            userId: user._id.toString(),
            email: user.email,
        });

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
            email: user.email,
        });
        const refreshToken = generateRefreshToken({
            userId: user._id.toString(),
            email: user.email,
        });

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
}
