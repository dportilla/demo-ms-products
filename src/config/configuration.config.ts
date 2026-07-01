import appConfig from '@/src/config/app.config';
import dbConfig from '@/src/config/db.config';
import natsServer from '@/src/config/nats.server';

export const configuration = [appConfig, dbConfig, natsServer];
