import { IsEmail, IsString, IsNotEmpty, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isFortyTwoAccount?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar?: string;

}

export default RegisterDto;
