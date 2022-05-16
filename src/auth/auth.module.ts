require('dotenv').config({ path: '.env.development' })
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UserRepository } from './user.repository'

@Module({
	imports: [
		TypeOrmModule.forFeature([UserRepository]),
		PassportModule,
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
