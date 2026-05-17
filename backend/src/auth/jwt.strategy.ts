import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Devolvemos el ID en múltiples formatos para máxima compatibilidad
    return { 
      id: user.id,
      userId: user.id, 
      sub: user.id,
      email: user.email, 
      username: user.username, 
      role: user.role 
    };
  }
}
