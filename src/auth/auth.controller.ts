import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { GetAuth } from '../common/decorators/get-auth.decorator'
import { Serialize } from '../common/interceptors/serialize.interceptor'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/request/create-user.dto'
import { SigninDto } from './dto/request/sigin.dto'
import { UpdateUserDto } from './dto/request/update-user.dto'
import { TokenDto } from './dto/response/token.dto'
import { UserDto } from './dto/response/user.dto'
import { User } from './entities/user.entity'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	@Serialize(TokenDto)
	create(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto)
	}

	@Post('/signin')
	@HttpCode(200)
	signin(@Body() body: SigninDto) {
		return this.authService.signin(body)
	}

	@Get('/')
	@UseGuards(JwtAuthGuard)
	@Serialize(UserDto)
	userInfo(@GetAuth() user: User) {
		return user
	}
}
