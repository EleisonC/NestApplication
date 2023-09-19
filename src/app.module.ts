import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DriversModule } from './drivers/drivers.module';
import { RideRequestModule } from './ride-request/ride-request.module';
import config from 'ormconfig';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(config),
    AuthModule,
    DriversModule,
    RideRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
