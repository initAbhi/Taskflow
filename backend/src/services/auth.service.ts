import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { JwtPayload } from '../types/auth.types';
import { createError } from '../middleware/error.middleware';
import { env } from '../config/env';

const SALT_ROUNDS = 12;

export class AuthService {
    private userRepo = AppDataSource.getRepository(User);

    async register(input: RegisterInput): Promise<{ user: Omit<User, 'password'>; token: string }> {
        const existing = await this.userRepo.findOne({ where: { email: input.email } });
        if (existing) {
            throw createError('An account with this email already exists', 409);
        }

        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

        const user = this.userRepo.create({
            name: input.name,
            email: input.email,
            password: hashedPassword,
        });

        const saved = await this.userRepo.save(user);
        const token = this.generateToken(saved);

        const { password: _pw, ...userWithoutPassword } = saved as User & { password: string };
        return { user: userWithoutPassword as Omit<User, 'password'>, token };
    }

    async login(input: LoginInput): Promise<{ user: Omit<User, 'password'>; token: string }> {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: input.email })
            .getOne();

        if (!user) {
            throw createError('Invalid email or password', 401);
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw createError('Invalid email or password', 401);
        }

        const token = this.generateToken(user);
        const { password: _pw, ...userWithoutPassword } = user as User & { password: string };
        return { user: userWithoutPassword as Omit<User, 'password'>, token };
    }

    async getAllUsers(): Promise<Pick<User, 'id' | 'name' | 'email'>[]> {
        return this.userRepo.find({
            select: ['id', 'name', 'email'],
            order: { name: 'ASC' },
        });
    }

    private generateToken(user: User): string {
        const payload: JwtPayload = { userId: user.id, email: user.email };
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
    }
}
