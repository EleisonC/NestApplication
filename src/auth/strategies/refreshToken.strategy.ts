import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: any) {
    if (payload.token_type !== 'refresh') {
      throw new UnauthorizedException();
    }
    const token = await this.tokenRepo.findOne({
      where: { owner: parseInt(payload.id) },
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    return { user: payload.sub, username: payload.username, id: payload.id };
  }
}
