import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule);
	const configService = appContext.get(ConfigService);

	const port = configService.getOrThrow<number>('app.port');

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.TCP,
			options: {
				port,
			},
		},
	);

	const logger = new Logger('Products-MS');

	// Use global validation pipe with whitelist and forbidNonWhitelisted options
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	await app.listen();
	logger.log(`Product Microservice is running on: ${port}`);
}
bootstrap();
