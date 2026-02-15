import {
  addBookService,
  updateBookService,
  allBooksListService,
  deleteBookService,
  borrowedBookListService,
  borrowBooksService,
  returnBookService,
  searchBookService,
  bulkBookUploadService,
  bookDetailsService,
} from '../service/book.service.js';

export const addBook = async (req, res) => {
  try {
    const { title, author } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const result = await addBookService(title, author);

    res.status(201).json({
      message: 'Book added successfully',
      response: result,
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    const { id } = req.params;

    if (!title || !author) {
      return res.status(400).json({
        message: 'Title and author are required',
      });
    }

    const result = await updateBookService(id, title, author);

    res.status(201).json({
      message: 'Book updated successfully',
      response: result,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Book ID is required',
      });
    }

    await deleteBookService(id);

    res.status(200).json({
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const borrowedBookList = async (req, res) => {
  try {
    const result = await borrowedBookListService();

    res.status(200).json({
      message: 'Borrowed book list fetched successfully',
      response: result,
    });
  } catch (error) {
    console.error('Error fetching borrowed book list:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const allBooksList = async (req, res) => {
  try {
    const { cursor, limit = 10, sortBy = 'id', order = 'asc' } = req.query;

    const result = await allBooksListService({
      cursor: cursor ? Number(cursor) : undefined,
      limit: Number(limit),
      sortBy,
      order,
    });

    res.status(200).json({
      message: 'All books list fetched successfully',
      response: result,
    });
  } catch (error) {
    console.error('Error fetching all books list:', error);
    res.status(500).json({ message: error.message });
  }
};

export const bookDetails = async (req, res) => {
  try {
    const { id } = req.params ?? '';
    console.log('checking query===>', req.params);
    if (!id) return res.status(400).json({ message: 'Book ID is required' });
    const result = await bookDetailsService(id);
    res.status(201).json({
      message: 'Book details',
      response: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const borrowBooks = async (req, res) => {
  try {
    const { id, userId } = req.body;

    const result = await borrowBooksService(id, userId);
    res.status(201).json({
      message: 'Book borrowed successfully',
      response: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const returnBook = async (req, res) => {
  try {
    const { id } = req.params ?? '';
    console.log('Returning book', id);

    const result = await returnBookService(id);

    res.status(201).json({
      message: 'Book return successfully',
      response: result,
    });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

export const searchBook = async (req, res) => {
  try {
    let { title = '', author = '', status = '' } = req.query ?? {};
    console.log('req.query', req.query);
    status = status.toUpperCase();

    const result = await searchBookService(title, author, status);
    console.log('result', result);

    res.status(200).json({
      message: 'Book search result',
      response: result,
    });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

export const bulkBookUpload = async (req, res) => {
  try {
    const bulkData = req?.file?.path;
    const result = await bulkBookUploadService(bulkData);
    res.status(200).json({ message: 'Books uploaded successfully', response: result });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};
