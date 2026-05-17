import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            username: any;
            role: any;
        };
    }>;
    signup(signupDto: SignupDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            username: any;
            role: any;
        };
    }>;
    refresh(token: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            username: any;
            role: any;
        };
    }>;
    private generateTokens;
}
