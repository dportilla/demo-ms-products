import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration.config';
import { envValidationSchema } from './config/env.validation';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: configuration,
			validationSchema: envValidationSchema,
		}),
		ProductsModule,
		PrismaModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
