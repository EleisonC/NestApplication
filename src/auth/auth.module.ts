import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { DriverJwtStrategy } from './strategies/jwt-driver-strategy';
import { ConsumerJwtStrategy } from './strategies/jwt-consumer-strategy';
import { DriversService } from 'src/drivers/drivers.service';
import { DriverProfile } from 'src/entities/drivers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, DriverProfile]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    DriverJwtStrategy,
    ConsumerJwtStrategy,
    RefreshJwtStrategy,
    DriversService,
  ],
})
export class AuthModule {}
