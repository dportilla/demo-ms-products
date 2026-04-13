import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { configuration } from './config/configuration.config';
import { envValidationSchema } from './config/env.validation';
import { ProductsModule } from './products/products.module';

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
