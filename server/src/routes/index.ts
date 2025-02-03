export default [
  {
    method: 'GET',
    path: '/',
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/strapi-react-icons-plugin/iconlibrary/find',
    handler: 'iconLibraryController.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/strapi-react-icons-plugin/iconlibrary/post',
    handler: 'iconLibraryController.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/strapi-react-icons-plugin/iconlibrary/update/:id',
    handler: 'iconLibraryController.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/strapi-react-icons-plugin/iconlibrary/delete/:id',
    handler: 'iconLibraryController.delete',
    config: {
      policies: [],
    },
  },
];
