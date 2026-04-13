import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);

	const logger = new Logger('Bootstrap');

	app.setGlobalPrefix('api');

	// Enable API versioning with URI versioning strategy
	app.enableVersioning({
		type: VersioningType.URI,
		prefix: 'v',
		defaultVersion: '1',
	});

	// Enable CORS using allowed origins from config
	// credentials: true allows cookies and auth headers
	app.enableCors({
		origin: configService.getOrThrow<string[]>('app.allowedOrigins'),
		credentials: true,
	});

	// Use global validation pipe with whitelist and forbidNonWhitelisted options
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	const port = configService.getOrThrow<number>('app.port');

	await app.listen(port, '0.0.0.0');
	logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
