// src/plugins/strapi-react-icons-plugin/server/src/services/iconLibraryService.ts
import type { Core } from '@strapi/strapi';

const iconLibraryService = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(query: any) {
    try {
      return await strapi.entityService.findMany(
        'plugin::strapi-react-icons-plugin.iconlibrary',
        query
      );
    } catch (e: any) {
      strapi.log.error(`Failed to find icon libraries ${e.message}`);
      throw new Error(`Failed to find icon libraries`);
    }
  },
  async create(data: any) {
    try {
      if (Array.isArray(data)) {
        const results = [];
        for (const entry of data) {
          if (!entry || !entry.abbreviation) {
            strapi.log.error(`Invalid entry format`);
            throw new Error(`Invalid entry format`);
          }
          const existing = await strapi.entityService.findMany(
            'plugin::strapi-react-icons-plugin.iconlibrary',
            { filters: { abbreviation: entry.abbreviation } }
          );
          if (existing.length === 0) {
            results.push(
              await strapi.entityService.create('plugin::strapi-react-icons-plugin.iconlibrary', {
                data: entry,
              })
            );
          }
        }
        return results;
      }
      if (!data || !data.abbreviation) {
        strapi.log.error(`Invalid entry format`);
        throw new Error('Invalid entry format');
      }
      const existing = await strapi.entityService.findMany(
        'plugin::strapi-react-icons-plugin.iconlibrary',
        { filters: { abbreviation: data.abbreviation } }
      );

      if (existing.length > 0) {
        throw new Error('Library already exists');
      }
      return await strapi.entityService.create('plugin::strapi-react-icons-plugin.iconlibrary', {
        data,
      });
    } catch (e: any) {
      strapi.log.error(`Create failed: ${e.message}`);
      throw e;
    }
  },

  async update(id: string, data: any) {
    try {
      return await strapi.entityService.update(
        'plugin::strapi-react-icons-plugin.iconlibrary',
        id,
        { data }
      );
    } catch (e: any) {
      strapi.log.error(`Failed to update icon library ${e.message}`);
      throw new Error(`Failed to update icon library`);
    }
  },
  async delete(id: string) {
    try {
      return await strapi.entityService.delete('plugin::strapi-react-icons-plugin.iconlibrary', id);
    } catch (e: any) {
      strapi.log.error(`Failed to delete icon library ${e.message}`);
      throw new Error(`Failed to delete icon library`);
    }
  },
});

export default iconLibraryService;
