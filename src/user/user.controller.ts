import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwt: JwtService;

  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userService.register(user);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const foundUser = await this.userService.login(user);
    if (!foundUser) {
      return 'login failed';
    }

    const token = await this.jwt.signAsync({
      user: {
        id: foundUser.id,
        username: foundUser.username,
      },
    });
    res.setHeader('token', token);
    return 'login success';
  }
}
