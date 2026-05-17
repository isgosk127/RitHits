import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.generateTokens(user);
  }

  async signup(signupDto: SignupDto) {
    const existingEmail = await this.usersService.findOne(signupDto.email);
    if (existingEmail) throw new ConflictException('El email ya está en uso');
    
    const existingUsername = await this.usersService.findByUsername(signupDto.username);
    if (existingUsername) throw new ConflictException('El nombre de usuario ya está en uso');

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const user = await this.usersService.create({
      email: signupDto.email,
      username: signupDto.username,
      password: hashedPassword,
    });

    return this.generateTokens(user);
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.email);
      
      if (!user || (user as any).refreshToken !== token) {
        throw new UnauthorizedException('Token de refresco inválido');
      }

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Token de refresco expirado o inválido');
    }
  }

  private async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id };
    
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
  }
}
