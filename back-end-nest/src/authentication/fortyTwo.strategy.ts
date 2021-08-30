import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import User from '../user/user.entity';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      clientID: '9bf776aebb6591e065d48ddfcc3d16da20f4390dc25be24084702d9560132e06',
      clientSecret: 'affd3a319e0abc6f0df8eb643a1524bbed9ddc481fb211952d2e4aa49fc5980f',
      callbackURL: "http://localhost:3000/authentication/callback"
    });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(email, password);
  }
}
