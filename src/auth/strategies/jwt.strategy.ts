import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../../common/types/jwt-payload.type'
import { UserRepository } from '../user.repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private userRepo: UserRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		})
	}

	async validate(payload: JwtPayload) {
		const { email } = payload
		const user = await this.userRepo.findOne({ email })
		if (!user) throw new UnauthorizedException()
		return user
	}
}
