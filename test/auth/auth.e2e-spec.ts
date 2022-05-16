import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { getConnection } from 'typeorm'
import { AppModule } from '../../src/app.module'

describe('Auth e2e spec', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	// Clear db
	afterEach(async () => {
		await getConnection().close()
		await getConnection().connect()
	})

  afterAll(async () => {
    await getConnection().close()
  })

	const signupUser = (email: string, password: string) => {
		return request(app.getHttpServer())
			.post('/auth/signup')
			.send({
				email,
				password,
			})
			.expect(201)
	}

	describe('signup a user', () => {
		it('should return error when provide invalid input (invalid email and password length < 4)', () => {
			return request(app.getHttpServer())
				.post('/auth/signup')
				.send({
					email: 'a@gmail',
					password: '123',
				})
				.expect(400)
		})

		it('should return conflict exception when signup with in use email', async () => {
			const email = 'email@email.com'
			const password = '1234'
			await signupUser(email, password)
			request(app.getHttpServer())
				.post('/auth/signup')
				.send({
					email,
					password,
				})
				.expect(409)
		})

		it('should return jwt token when provide valid email and password and login success', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/signup')
				.send({
					email: 'email@email.com',
					password: '1234',
				})
				.expect(201)

			expect(response.body.access_token).toBeDefined()
		})

		it("should return user info when use jwt token to get info and not return user's password", async () => {
			const email = 'getUserInfo@gmail.com'
			const password = '1234'
			const response = await signupUser(email, password)
			const token = response.body.access_token
			const response2 = await request(app.getHttpServer())
				.get('/auth')
				.set('Authorization', 'Bearer ' + token)
				.send()
				.expect(200)

			expect(response2.body.email).toBeDefined()
			expect(response2.body.password).toBeUndefined()
		})
	})

	describe('sigin user', () => {
		it('should signin when valid input is provided', async () => {
			const email = 'loginuser@gmail.com'
			const password = '1234'
			await signupUser(email, password)
			const response = await request(app.getHttpServer())
				.post('/auth/signin')
				.send({
					email,
					password,
				})
				.expect(200)
			expect(response.body.access_token).toBeDefined()
		})
	})
})
