import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import axios from 'axios';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, 'fortyTwo') {
  constructor() {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: '9bf776aebb6591e065d48ddfcc3d16da20f4390dc25be24084702d9560132e06',
      clientSecret: 'affd3a319e0abc6f0df8eb643a1524bbed9ddc481fb211952d2e4aa49fc5980f',
      callbackURL: `${ process.env.FRONT_URL }/oauth-forty-two`,
    });
  }

  async validate(accessToken: string): Promise<any> {
    do {
      try {
        const { data } = await axios.get('https://api.intra.42.fr/v2/me', { headers: {
          authorization: 'Bearer ' + accessToken,
        }});
        return {
          email: data.email,
          name: data.login,
          password: '',
          isFortyTwoAccount: true,
          avatar: data.image_url,
        };
      }
      catch ({ response }) {
        if (response.status !== 429) {
          throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    } while (true);
  }
}
