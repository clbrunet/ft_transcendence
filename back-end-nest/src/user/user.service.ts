import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import RegisterDto from '../authentication/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.userRepository.update(userId, {
      twoFactorAuthenticationSecret: secret
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return this.userRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true
    });
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne( id );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async create(registerData: RegisterDto) {
    const newUser = await this.userRepository.create(registerData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
    return await this.userRepository.find();
  }

}
