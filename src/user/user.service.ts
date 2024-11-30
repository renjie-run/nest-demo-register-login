import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  private logger = new Logger();

  async getUserByName(username) {
    return await this.userRepository.findOneBy({ username });
  }

  async register(user: RegisterDto) {
    const foundUser = await this.getUserByName(user.username);
    if (foundUser) {
      throw new HttpException('user already exist', 400);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return 'success';
    } catch (error) {
      this.logger.error(error, UserService);
      return 'register user failed';
    }
  }

  async login(user: LoginDto) {
    const foundUser = await this.getUserByName(user.username);
    if (!foundUser) {
      throw new HttpException('username not exist', 404);
    }

    if (foundUser.password !== md5(user.password)) {
      throw new HttpException('username and password do not match', 400);
    }
    return foundUser;
  }
}
