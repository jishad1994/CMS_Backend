import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),

    email: z.string().trim().email("Please provide a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/\d/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
    email: z.string().trim().email("Please provide a valid email address"),

    password: z.string().min(1, "Password is required"),
});

//  regex for JWT structure (header.payload.signature)
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export const AuthCookiesSchema = z.object({
    accessToken: z.string().regex(jwtRegex, "Invalid token format"),
    refreshToken: z.string().regex(jwtRegex, "Invalid token format"),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthUserResponseDto {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponseDto {
    user: AuthUserResponseDto;
    accessToken: string;
    refreshToken: string;
}
