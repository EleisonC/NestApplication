import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/gaurds/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findCurrentUser(@Request() req) {
    return await this.userService.findOneById(req.user.id);
  }
}
