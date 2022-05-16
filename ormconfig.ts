import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'

let config: SqliteConnectionOptions & TypeOrmModuleOptions = {
	type: 'sqlite',
	database: 'db',
	entities: ['**/*.entity.js'],
	autoLoadEntities: true,
	// synchronize: false,
	synchronize: true,
	// migrations: ['dist/migrations/*.js'],
	// cli: {
	// 	migrationsDir: 'migrations',
	// },
}

switch (process.env.NODE_ENV) {
	case 'test':
		config = {
			...config,
			database: ':memory:',
			autoLoadEntities: true,
			synchronize: true,
			dropSchema: true,
		}
}

export default config
