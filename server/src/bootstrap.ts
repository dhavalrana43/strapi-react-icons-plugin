// server\src\bootstrap.ts
import type { Core } from '@strapi/strapi';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access react-icons menu',
      uid: 'read',
      pluginName: 'react-icons',
    },
  ];

  await (strapi as any).admin?.services.permission.actionProvider.registerMany(actions);
};

export default bootstrap;
