import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/src/common/prisma/prisma.module';
import { envValidationSchema } from '@/src/config/env.validation';
import { systemConfig } from '@/src/config/system.config';
import { ProductsModule } from '@/src/products/products.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: systemConfig,
			validationSchema: envValidationSchema,
		}),
		ProductsModule,
		PrismaModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
