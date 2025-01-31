import type { Core } from '@strapi/strapi';

const iconLibraryService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(query: any) {
    try {
      return await strapi.entityService.findMany(
        'plugin::strapi-react-icons-plugin.iconlibrary',
        query
      );
    } catch (e) {
      strapi.log.error(`Failed to find icon libraries ${e}`);
      throw new Error(`Failed to find icon libraries`);
    }
  },
  async create(data: any) {
    try {
      return await strapi.entityService.create('plugin::strapi-react-icons-plugin.iconlibrary', {
        data,
      });
    } catch (e) {
      strapi.log.error(`Failed to create icon library ${e}`);
      throw new Error(`Failed to create icon library`);
    }
  },
  async update(id: string, data: any) {
    try {
      return await strapi.entityService.update(
        'plugin::strapi-react-icons-plugin.iconlibrary',
        id,
        { data }
      );
    } catch (e) {
      strapi.log.error(`Failed to update icon library ${e}`);
      throw new Error(`Failed to update icon library`);
    }
  },
  async delete(id: string) {
    try {
      return await strapi.entityService.delete('plugin::strapi-react-icons-plugin.iconlibrary', id);
    } catch (e) {
      strapi.log.error(`Failed to delete icon library ${e}`);
      throw new Error(`Failed to delete icon library`);
    }
  },
});

export default iconLibraryService;
