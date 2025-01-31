import type { Core } from '@strapi/strapi';

const iconLibraryController = ({ strapi }: { strapi: Core.Strapi }) => {
  const getService = () => strapi.plugin('strapi-react-icons-plugin').service('iconLibraryService');

  return {
    async find(ctx) {
      try {
        ctx.body = await getService().find(ctx.query);
      } catch (error: any) {
        ctx.throw(500, error.message);
      }
    },

    async create(ctx) {
      try {
        await getService().create(ctx.request.body);
        ctx.body = await getService().find();
      } catch (error: any) {
        ctx.throw(500, error.message);
      }
    },

    async update(ctx) {
      try {
        await getService().update(ctx.params.id, ctx.request.body);
        ctx.body = await getService().find();
      } catch (error: any) {
        ctx.throw(500, error.message);
      }
    },

    async delete(ctx) {
      try {
        ctx.body = await getService().delete(ctx.params.id);
      } catch (error: any) {
        ctx.throw(500, error.message);
      }
    },
  };
};

export default iconLibraryController;
