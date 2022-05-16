import {
	CallHandler,
	ExecutionContext,
	NestInterceptor,
	UseInterceptors,
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { map, Observable } from 'rxjs'

interface ClassContructor {
	new (...args: any[]): {}
}

export function Serialize(dto: ClassContructor) {
	return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: ClassContructor) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(
			map((data) => {
				return plainToClass(this.dto, data, {
					excludeExtraneousValues: true,
				})
			})
		)
	}
}
