import type { Core } from '@strapi/strapi';

const iconLibraryController = ({ strapi }: { strapi: Core.Strapi }) => {
  const getService = () => strapi.plugin('strapi-react-icons-plugin').service('iconLibraryService');

  return {
    async find(ctx) {
      try {
        ctx.body = await getService().find(ctx.query);
      } catch (error: any) {
        strapi.log.error(`Error finding icon libraries: ${error.message}`);
        ctx.throw(500, 'Failed to fetch icon libraries');
      }
    },

    async create(ctx) {
      try {
        await getService().create(ctx.request.body);
        ctx.body = await getService().find();
      } catch (error: any) {
        strapi.log.error(`Error creating icon library: ${error.message}`);
        ctx.throw(500, 'Failed to create icon library');
      }
    },

    async update(ctx) {
      try {
        await getService().update(ctx.params.id, ctx.request.body);
        ctx.body = await getService().find();
      } catch (error: any) {
        strapi.log.error(`Error updating icon library: ${error.message}`);
        ctx.throw(500, 'Failed to update icon library');
      }
    },

    async delete(ctx) {
      try {
        ctx.body = await getService().delete(ctx.params.id);
      } catch (error: any) {
        strapi.log.error(`Error deleting icon library: ${error.message}`);
        ctx.throw(500, 'Failed to delete icon library');
      }
    },
  };
};

export default iconLibraryController;
