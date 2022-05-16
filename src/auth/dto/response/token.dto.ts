import { Expose } from 'class-transformer'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class TokenDto {
	@Expose()
	access_token: string
}
