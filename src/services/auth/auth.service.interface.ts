import { AuthResponseDto, LoginDto, RegisterDto } from "../../dtos/auth.dto";

export interface IAuthService {
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    logout(oldRefreshToken: string): Promise<void>;
    refresh(oldRefreshToken: string): Promise<AuthResponseDto>;
}
