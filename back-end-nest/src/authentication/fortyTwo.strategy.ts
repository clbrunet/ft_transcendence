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
      clientID: process.env.CLIENT_ID_42,
      clientSecret: process.env.CLIENT_SECRET_42,
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
