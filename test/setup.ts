import { getConnection } from 'typeorm'

// In here we can assign util functions to be global function to use easily in our test
declare global {
	function signin(): Promise<void>
	// Declare global var
	var a: string
}

// Initialize it
global.a = 'adsa'

afterAll(async () => {
	// await getConnection().close()
})

global.signin = async () => {
	// const email = 'test@test.com'
	// const password = 'password'
	// const response = await request(app)
	// 	.post('/api/users/signup')
	// 	.send({ email, password })
	// 	.expect(201)
	// return response.get('Set-Cookie')
}
