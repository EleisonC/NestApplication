import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ConsumerJwtStrategy extends PassportStrategy(
  Strategy,
  'consumer-jwt',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneById(parseInt(payload.id));
    if (user.role !== 'consumer') {
      throw new UnauthorizedException('Access denied');
    }
    return { user: payload.sub, username: payload.username, id: payload.id };
  }
}
