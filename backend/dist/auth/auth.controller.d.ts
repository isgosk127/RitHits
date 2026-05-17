import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
