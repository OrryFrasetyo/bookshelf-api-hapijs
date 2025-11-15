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

const getAllBooksHandler = (request, h) => {
  try {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    if (name !== undefined) {
      filteredBooks = filteredBooks.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (reading !== undefined) {
      filteredBooks = filteredBooks.filter(
        (book) => book.reading === (reading === '1')
      );
    }

    if (finished !== undefined) {
      filteredBooks = filteredBooks.filter(
        (book) => book.finished === (finished === '1')
      );
    }

    const responseBooks = filteredBooks.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books: responseBooks,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);

    const response = h.response({
      status: 'error',
      message: 'Gagal menampilkan buku karena terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  try {
    const { id } = request.params;

    const book = books.find((n) => n.id === id);

    if (book) {
      const response = h.response({
        status: 'success',
        data: {
          book: {
            id: book.id,
            name: book.name,
            year: book.year,
            author: book.author,
            summary: book.summary,
            publisher: book.publisher,
            pageCount: book.pageCount,
            readPage: book.readPage,
            finished: book.finished,
            reading: book.reading,
            insertedAt: book.insertedAt,
            updatedAt: book.updatedAt,
          },
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  } catch (error) {
    console.error(error);

    const response = h.response({
      status: 'error',
      message:
        'Gagal menampilkan detail buku karena terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

const editBookByIdHandler = (request, h) => {
  try {
    const { id } = request.params;

    const { name, pageCount, readPage } = request.payload;

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const finished = pageCount === readPage;

    books[index] = {
      ...books[index],
      ...request.payload,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error(error);

    const response = h.response({
      status: 'error',
      message: 'Gagal memperbarui buku karena terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  try {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } catch (error) {
    console.error(error);

    const response = h.response({
      status: 'error',
      message: 'Gagal menghapus buku karena terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
