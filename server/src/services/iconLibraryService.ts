import type { Core } from '@strapi/strapi';

const iconLibraryService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(query: any) {
    return await strapi.entityService.findMany(
      'plugin::strapi-react-icons-plugin.iconlibrary',
      query
    );
  },
  async create(data: any) {
    return await strapi.entityService.create('plugin::strapi-react-icons-plugin.iconlibrary', data);
  },
  async update(id: string, data: any) {
    return await strapi.entityService.update(
      'plugin::strapi-react-icons-plugin.iconlibrary',
      id,
      data
    );
  },
  async delete(id: string) {
    return await strapi.entityService.delete('plugin::strapi-react-icons-plugin.iconlibrary', id);
  },
});

export default iconLibraryService;
