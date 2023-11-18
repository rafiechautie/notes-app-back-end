/**
 * fungsi halaman server.js adalah Memuat kode konfigurasi routing server
 *  seperti menentukan path, method, dan handler yang digunakan.
 */

// menggunakan module hapi
// eslint-disable-next-line import/no-extraneous-dependencies
const Hapi = require('@hapi/hapi');
// import module routes dan gunakan array routes
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
