import type { Core } from '@strapi/strapi';
import defaultData from './data/default.json';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access React Icons plugin',
      uid: 'read',
      pluginName: 'strapi-react-icons-plugin',
    },
  ];
  await strapi.admin?.services.permission.actionProvider.registerMany(actions);

  const pluginStore = strapi.store({
    type: 'plugin',
    name: 'strapi-react-icons-plugin',
  });

  if (!(await pluginStore.get({ key: 'hasCreated' }))) {
    console.log('Default data:', defaultData);
    try {
      const existing = await strapi.entityService.findMany(
        'plugin::strapi-react-icons-plugin.iconlibrary'
      );
      if (existing.length === 0) {
        await Promise.all(
          defaultData.map(async (entry) => {
            await strapi.entityService.create('plugin::strapi-react-icons-plugin.iconlibrary', {
              data: entry,
            });
          })
        );
      }
      await pluginStore.set({ key: 'hasCreated', value: true });
    } catch (e) {
      strapi.log.error(`Bootstrap failed: ${e}`);
    }
  }
};

export default bootstrap;
