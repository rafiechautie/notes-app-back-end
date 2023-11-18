/* eslint-disable max-len */
/**
 * fungsi halaman handler.js adalah Memuat seluruh fungsi-fungsi handler yang digunakan pada
 * berkas routes.
 */

/**
 * import library nanoid dan module notes
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const notes = require('./notes');

/**
 *
 * method untuk menambahkan notes
 */
const addNoteHandler = (request, h) => {
  // mendapatkan body / value yang diinput user menggunakan request.payload
  const { title, tags, body } = request.payload;

  /**
   * menggunakan library nanoid, parameter di dalamnya memrepresentasikan ukuran dari string
   */
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  // karena kasusnya addNoteHandler, maka createdAt dan updateAt pasti nilainya sama
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  /**
   * memasukkan nilai-nilai yang diinput user serta yang dibikin oleh sistem
   * ke dalam array notes menggunakan method push()
   */
  notes.push(newNote);

  // method filter() untuk mengetahui apakah newNote sudah masuk ke array notes atau belum
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // gunakan isSucces untuk memberikan respons berhasil
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  // jika responsenya gagal
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

/**
 *
 * method untuk menampilkan semua notes di halaman home
 */
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

/**
 * method untuk menampilakan detail notes
 */
const getNoteByIdHandler = (request, h) => {
  // mendapatkan id dengan request.params
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  // Jika variable note ada isinya maka kasih pesan sukses
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  // Jika variable note tidak ada isinya maka kasih pesan gagal
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

/**
 *
 * method untuk menampilkan semua edit notes berdasarkan ID
 */
const editNoteByIdHandler = (request, h) => {
  // ambil id menggunakan request.params
  const { id } = request.params;

  // mendapatkan data title, tags, dan body
  const { title, tags, body } = request.payload;
  const updateAt = new Date().toISOString();

  /**
   *  Bila note dengan id yang dicari ditemukan, maka index akan bernilai array
   * index dari objek catatan yang dicari. Namun bila tidak ditemukan, maka index bernilai -1
   */
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      // Spread operator pada kode di atas digunakan untuk mempertahankan nilai notes[index] yang tidak perlu diubah
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

/**
 *
 * method untuk menghapus notes berdasarkan ID
 */
const deleteNoteByIdHandler = (request, h) => {
  // mengambil data id
  const { id } = request.params;

  // mengecek apakah id sama dengan id yang ada di array notes, jika nilai index -1 maka gagal untuk menghapus
  const index = notes.findIndex((note) => note.id === id);

  // menghapus data notes menggunapak methode splice()
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // Bila index bernilai -1, maka kembalikan handler dengan respons gagal.
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler,
};
