import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/src/common/prisma/prisma.module';
import { configuration } from '@/src/config/configuration.config';
import { envValidationSchema } from '@/src/config/env.validation';
import { ProductsModule } from '@/src/products/products.module';

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
