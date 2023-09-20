import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DriversService } from 'src/drivers/drivers.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly tokenRepo: Repository<RefreshToken>,
    private readonly userService: UserService,
    private readonly driverService: DriversService,
    private jwtService: JwtService,
  ) {}

  async validate(username: string, password: string) {
    const user = await this.userService.findOneByEmail(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.email,
      id: user.id,
      role: user.role,
      sub: {
        name: user.name,
      },
    };

    const accessPayload = {
      ...payload,
      token_type: 'access',
    };

    const refreshPayload = {
      ...payload,
      token_type: 'refresh',
    };

    const refreshTokenBef = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    const token = this.tokenRepo.create({
      token: refreshTokenBef,
      owner: user.id,
    });

    const finalRes = await this.tokenRepo.save(token);

    return {
      ...user,
      accessToken: this.jwtService.sign(accessPayload),
      refreshToken: finalRes.token,
    };
  }

  async refresh(user: User) {
    const payload = {
      username: user.email,
      id: user.id,
      role: user.role,
      token_type: 'access',
      sub: {
        name: user.name,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async logout(userId: number) {
    const user = await this.userService.findOneById(userId);
    if (user.role === 'driver') {
      await this.driverService.updateProfileAvailability(userId);
    }
    await this.tokenRepo.delete({ owner: userId });
  }
}
