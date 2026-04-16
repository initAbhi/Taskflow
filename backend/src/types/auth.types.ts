export interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
}
