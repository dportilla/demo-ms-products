import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);
	constructor(configService: ConfigService) {
		super({
			adapter: new PrismaPg({
				connectionString: configService.getOrThrow<string>('db.url'),
			}),
		});
	}

	async onModuleInit() {
		try {
			await this.$connect();
			this.logger.log('Connected to the database PG');
		} catch (error) {
			this.logger.error(`Failed to connect to the database: ${error}`);
		}
	}

	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log('Disconnected from the database');
	}
}
