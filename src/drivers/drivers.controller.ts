import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { JwtGuard } from 'src/auth/gaurds/jwt-auth.guard';
import { DriverJwtGuard } from 'src/auth/gaurds/jwt-driver-strategy';

@Controller('drivers')
export class DriversController {
  constructor(private driversService: DriversService) {}

  @UseGuards(JwtGuard)
  @Post('register')
  async create(@Request() req) {
    const id = req.user.id;
    return await this.driversService.create(parseInt(id));
  }

  @UseGuards(JwtGuard)
  @UseGuards(DriverJwtGuard)
  @Get('profile')
  async findOne(@Request() req) {
    const id = req.user.id;
    return await this.driversService.findOneByUserId(parseInt(id));
  }

  @UseGuards(JwtGuard)
  @UseGuards(DriverJwtGuard)
  @Post('profile/availability')
  async updateProfileAvailability(@Request() req) {
    const id = req.user.id;
    return await this.driversService.updateProfileAvailability(parseInt(id));
  }

  @UseGuards(JwtGuard)
  @UseGuards(DriverJwtGuard)
  @Delete('profile/delete')
  async deleteProfile(@Request() req) {
    const id = req.user.id;
    return await this.driversService.deleteProfile(parseInt(id));
  }
}
