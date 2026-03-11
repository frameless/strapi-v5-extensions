export default [
  {
    method: 'GET',
    path: '/notes',
    handler: 'noteController.find',
  },
  {
    method: 'GET',
    path: '/notes/by-document',
    handler: 'noteController.findByDocument',
  },
  {
    method: 'POST',
    path: '/notes',
    handler: 'noteController.create',
  },
  {
    method: 'DELETE',
    path: '/notes/:id',
    handler: 'noteController.delete',
  },
  {
    method: 'PUT',
    path: '/notes/:id',
    handler: 'noteController.update',
  },
];
