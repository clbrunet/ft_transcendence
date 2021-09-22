import { IsEmail, IsString, IsNotEmpty, MinLength, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
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
