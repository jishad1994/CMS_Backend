import { AuthResponseDto, LoginDto, RegisterDto } from "../../dtos/auth.dto";

export interface IAuthService {
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
}
