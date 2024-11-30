import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: 'username can only contains letters and numbers',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  password: string;
}
