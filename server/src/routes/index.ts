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
    path: '/iconlibrary/find',
    handler: 'iconLibraryController.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/iconlibrary/post',
    handler: 'iconLibraryController.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/iconlibrary/update/:id',
    handler: 'iconLibraryController.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/iconlibrary/delete/:id',
    handler: 'iconLibraryController.delete',
    config: {
      policies: [],
    },
  },
];
