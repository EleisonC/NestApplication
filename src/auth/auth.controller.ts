import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGaurd } from './gaurds/local-auth.guard';
import { RefreshJwtGuard } from './gaurds/refresh-jwt-auth.guards';
import { CreateUserDto } from 'src/user/dto/userdto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGaurd)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async createNewUser(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return await this.authService.refresh(req.user);
  }
}
