import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { JwtPayload } from 'src/common/types/jwt-payload.type'
import { CreateUserDto } from './dto/request/create-user.dto'
import { SigninDto } from './dto/request/sigin.dto'
import { TokenDto } from './dto/response/token.dto'
import { UserRepository } from './user.repository'

@Injectable()
export class AuthService {
	constructor(
		private userRepo: UserRepository,
		private jwtService: JwtService
	) {}

	async create(createAuthDto: CreateUserDto): Promise<TokenDto> {
		// create user
		const { email, password } = createAuthDto
		const existUser = await this.userRepo.findOne({ email })
		if (existUser) throw new ConflictException('email in use')
		const passwordHashed = bcrypt.hashSync(password, 10)
		const user = this.userRepo.create({ email, password: passwordHashed })
		await this.userRepo.save(user)
		const token = this.createJwtToken({
			email,
		})
		return { access_token: token }
	}

	async signin({ email, password }: SigninDto): Promise<TokenDto> {
		const user = await this.userRepo.findOne({ email })
		if (!user) throw new BadRequestException()
		if (!bcrypt.compareSync(password, user.password))
			throw new BadRequestException()

		const token = this.createJwtToken({ email })
		return { access_token: token }
	}

	createJwtToken(payload: JwtPayload): string {
		const token = this.jwtService.sign(payload, {
			secret: process.env.JWT_SECRET,
			expiresIn: 60 * 60 * 24 * 7,
		})
		return token
	}
}
