import packageInfo from '../package.json';
import env from './env';

const app = {
  version: packageInfo.version,
  name: '3arida - Petition Platform',
  logoUrl: '/logo.png', // We'll need to add this
  url: env.appUrl,
};

export default app;
