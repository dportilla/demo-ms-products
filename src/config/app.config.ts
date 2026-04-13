import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
	return {
		port: Number(process.env.PORT ?? 3000),
	};
});
