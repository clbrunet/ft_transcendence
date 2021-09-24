import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Post, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import RequestWithUser from '../authentication/requestWithUser.interface';

import { UserService } from './user.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { UserUpdateDto } from '../user/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('/index')
  async getAllLazy() {
    return await this.userService.getAllLazy();
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
/*
  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAllLazy() {
    return await this.userService.findAllLazy();
  }
*/
  // ROUTES NOT FOR DEV
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
          callback(null, req.user.id);
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

  async uploadAvatar(@Req() request: RequestWithUser, @UploadedFile() file) {
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.avatar = (process.env.URL || "http://localhost:3000") + "/user/avatar/" + request.user.id;
    await this.userService.update(request.user.id, userUpdateDto);
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/avatar/:filename')
  getAvatar(@Param('filename') filename, @Res() res): any {
    return res.sendFile(filename, { root: './avatars' });
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

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  async delete(@Param('id') id) {
    return await this.userService.delete(id);
  }
*/
}
