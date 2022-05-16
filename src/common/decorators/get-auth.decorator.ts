import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetAuth = createParamDecorator(
	(_data: any, context: ExecutionContext) => {
		const req = context.switchToHttp().getRequest()
		if (!req.user) return null
		return req.user
	}
)
