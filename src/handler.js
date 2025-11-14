const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  try {
    const { name, pageCount, readPage } = request.payload;

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();

    const newBook = {
      ...request.payload,
      id,
      finished,
      insertedAt,
      updatedAt: insertedAt,
    };

    books.push(newBook);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan karena terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

module.exports = { addBookHandler };
