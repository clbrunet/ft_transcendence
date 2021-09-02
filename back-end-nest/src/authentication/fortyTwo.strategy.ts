import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import axios from 'axios';
import RegisterDto from './register.dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, 'fortyTwo') {
  constructor() {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: '9bf776aebb6591e065d48ddfcc3d16da20f4390dc25be24084702d9560132e06',
      clientSecret: 'affd3a319e0abc6f0df8eb643a1524bbed9ddc481fb211952d2e4aa49fc5980f',
      callbackURL: "http://localhost:8080/oauth-forty-two",
    });
  }

  async validate(accessToken: string): Promise<any> {
    try {
      const { data } = await axios.get('https://api.intra.42.fr/v2/me', { headers: {
      authorization: 'Bearer ' + accessToken,
      }});
      const user: RegisterDto = {
      email: data.email,
      name: data.login,
      password: '',
      isFortyTwoAccount: true,
      avatar: data.image_url,
      };
      return user;
    }
    catch {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
