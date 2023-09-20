import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { RideRequestService } from './ride-request.service';
import { JwtGuard } from 'src/auth/gaurds/jwt-auth.guard';
import { RideRequestDto } from './dto/riderRequestDto';
import { ConsumerJwGuard } from 'src/auth/gaurds/jwt-consumer-guard';
import { DriverJwtGuard } from 'src/auth/gaurds/jwt-driver-guard';

@Controller('ride-request')
export class RideRequestController {
  constructor(private readonly rideRequestService: RideRequestService) {}

  @UseGuards(JwtGuard)
  @UseGuards(ConsumerJwGuard)
  @Post('create')
  async create(@Request() req, @Body() rideRequestDto: RideRequestDto) {
    const id = req.user.id;
    return await this.rideRequestService.create(rideRequestDto, parseInt(id));
  }

  @UseGuards(JwtGuard)
  @UseGuards(DriverJwtGuard)
  @Get('driver/requests')
  async findDriverRideRequests(@Request() req) {
    const id = req.user.id;
    return await this.rideRequestService.findDriverRideRequests(parseInt(id));
  }

  @UseGuards(JwtGuard)
  @UseGuards(DriverJwtGuard)
  @Get('driver/ongoing/requests')
  async findPendingActiveDriverRideReqs(@Request() req) {
    const id = req.user.id;
    return await this.rideRequestService.findPendingActiveDriverRideReqs(
      parseInt(id),
    );
  }

  @UseGuards(JwtGuard)
  @UseGuards(DriverJwtGuard)
  @Patch('driver/accept/request/:id')
  async acceptRideReq(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return await this.rideRequestService.findOneAndAccept(
      parseInt(id),
      parseInt(userId),
    );
  }

  @UseGuards(JwtGuard)
  @UseGuards(DriverJwtGuard)
  @Patch('driver/complete/request/:id')
  async completeRideReq(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return await this.rideRequestService.findOneAndComplete(
      parseInt(id),
      parseInt(userId),
    );
  }

  @UseGuards(JwtGuard)
  @UseGuards(DriverJwtGuard)
  @Patch('driver/cancel/request/:id')
  async cancelByDriver(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return await this.rideRequestService.findOneAndCancelByDriver(
      parseInt(id),
      parseInt(userId),
    );
  }

  @UseGuards(JwtGuard)
  @UseGuards(ConsumerJwGuard)
  @Patch('consumer/cancel/request/:id')
  async cancelByUser(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return await this.rideRequestService.findOneAndCancelByUser(
      parseInt(id),
      parseInt(userId),
    );
  }

  @UseGuards(JwtGuard)
  @UseGuards(ConsumerJwGuard)
  @Get('consumer/requests')
  async findUserRideRequests(@Request() req) {
    const id = req.user.id;
    return await this.rideRequestService.findUserRideRequests(parseInt(id));
  }

  @UseGuards(JwtGuard)
  @UseGuards(ConsumerJwGuard)
  @Get('consumer/ongoing/requests')
  async findPenActUserRideRequests(@Request() req) {
    const id = req.user.id;
    return await this.rideRequestService.findPendingActiveUserRideReqs(
      parseInt(id),
    );
  }

  @UseGuards(JwtGuard)
  @Get('all')
  async findAllRequests(
    @Query('page') page: number = 1,
    @Query('perPage') perpage: number = 10,
  ) {
    return await this.rideRequestService.findAll(page, perpage);
  }
}
