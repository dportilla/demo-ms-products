import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
	const rawOrigins = process.env.ALLOWED_ORIGINS ?? '';

	return {
		port: Number(process.env.PORT ?? 3000),
		allowedOrigins: rawOrigins
			.split(',')
			.map((o) => o.trim())
			.filter(Boolean),
	};
});
