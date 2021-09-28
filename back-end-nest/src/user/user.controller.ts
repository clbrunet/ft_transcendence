import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Post, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import RequestWithUser from '../authentication/requestWithUser.interface';

import { UserService } from './user.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { UserUpdateDto } from '../user/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('/index')
  async getAllLazy() {
    return await this.userService.getAllLazy();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAllAdmin(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.userService.getAllAdmin(user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/:id')
  async getbyIdLazy(@Param('id') id) {
    return await this.userService.getByIdLazy(id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './avatars',
        filename: (req: any, file: any, callback: any) => {
          callback(null, req.user.name + extname(file.originalname));
        }
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Please send an image file'), false);
        }
        callback(null, true);
      }
    }),
  )

  async uploadAvatar(@Req() request: RequestWithUser, @UploadedFile() file: any) {
    let userUpdateDto = new UserUpdateDto();
    let filename = (process.env.URL || "http://localhost:3000") + "/user/avatar/" + request.user.name + extname(file.originalname);
    userUpdateDto.avatar = filename;
    await this.userService.update(request.user.id, userUpdateDto);
    return filename;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/avatar/:filename')
  getAvatar(@Param('filename') filename, @Res() res): any {
    return res.sendFile(filename, { root: './avatars' });
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/admin/:id')
  async setAsAdmin(@Req() request: RequestWithUser, @Param('id') id) {
    const {user} = request;
    return await this.userService.updateAdmin(user, id, true);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/unadmin/:id')
  async unsetAsAdmin(@Req() request: RequestWithUser, @Param('id') id) {
    const {user} = request;
    return await this.userService.updateAdmin(user, id, false);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  async deleteAdmin(@Req() request: RequestWithUser, @Param('id') id) {
    const {user} = request;
    return await this.userService.deleteAdmin(user, id);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
/*
  @UseGuards(JwtTwoFactorGuard)
  @Get('/eager/:id')
  async findbyId(@Param('id') id) {
    return await this.userService.findById(id);
  }

  @Patch('/:id')
  async update(@Param('id') id, @Body() userUpdateDto: UserUpdateDto) {
    return this.userService.update(id, userUpdateDto);
  }
*/

}
