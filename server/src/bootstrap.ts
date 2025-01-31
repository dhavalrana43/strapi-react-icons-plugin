import type { Core } from '@strapi/strapi';
import defaultData from './data/default.json';

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
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'strapi-react-icons-plugin',
  });
  const hasCreated = await pluginStore.get({ key: 'hasCreated' });

  if (!hasCreated) {
    try {
      await Promise.all(
        defaultData.map(async (entry) => {
          await strapi.entityService.create('plugin::strapi-react-icons-plugin.iconlibrary', {
            data: entry,
          });
        })
      );
      await pluginStore.set({ key: 'hasCreated', value: true });
    } catch (e) {
      strapi.log.error(`Failed to seed default data in bootstrap: ${e}`);
    }
  }
};

export default bootstrap;
