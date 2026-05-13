import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@/generated/prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);
	constructor(configService: ConfigService) {
		const adapter = new PrismaBetterSqlite3({
			url: configService.getOrThrow<string>('db.url'),
		});

		super({
			adapter,
		});
	}

	async onModuleInit() {
		try {
			await this.$connect();
			this.logger.log('Connected to the database Sqlite');
		} catch (error) {
			this.logger.error(`Failed to connect to the database: ${error}`);
		}
	}

	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log('Disconnected from the database');
	}
}
