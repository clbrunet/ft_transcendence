import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import User from '../user/user.entity';

import { AuthenticationService } from './authentication.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email' // change the name of one of the two expected fields
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authenticationService.getAuthenticatedUser(email, password);
    if (user.isFortyTwoAccount === true) {
      throw new HttpException('Please login with the 42 strategy', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
