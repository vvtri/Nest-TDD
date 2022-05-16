import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
require('dotenv').config({
	path: '.env.development',
})

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	await app.listen(3000)
}
bootstrap()
