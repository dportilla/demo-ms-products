import appConfig from '@/src/config/app.config';
import dbConfig from '@/src/config/db.config';
import natsServer from '@/src/config/nats.server';

export const systemConfig = [appConfig, dbConfig, natsServer];
