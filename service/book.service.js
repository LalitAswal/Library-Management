import Book from "../database/booksdb.js";
import BorrowHistory from "../database/borrowHistorydb.js";

export const addBookService = async (title, author) => {
  const bookIsExists = await Book.findOne({
    where: {
      title,
      author,
    },
  });

  console.log("bookIsExists", bookIsExists);
  if (bookIsExists) {
    throw new Error(`Book with title ${title} already exists`);
  }
  const book = await Book.create({ title, author });
  return book;
};

export const updateBookService = async (id, title, author) => {
  const updatedData = await Book.update(
    { id, title, author },
    {
      where: {
        id,
      },
      returning: true,
    }
  );

  return updatedData;
};

export const deleteBookService = async (id) => {
  const softDeleteBook = await Book.update(
    { isDeleted: true },
    {
      where: {
        id,
      },
    }
  );

  return softDeleteBook;
};

export const borrowedBookListService = async () => {
  const borrowedBookList = await BorrowHistory.findAll();
  return borrowedBookList;
};

export const allBooksListService = async () => {
  const allBooksList = await Book.findAll({ where: { isDeleted: false } });
  return allBooksList;
};

export const borrowBooksService = async (id,userId) => {

  const bookAvailableInBook = await Book.findOne({ where: { id } });
  const bookInBorrowBook = await BorrowHistory.findOne({ where: { id } });

  if (!bookAvailableInBook && !bookInBorrowBook) {
    throw new Error(`Book doesn't exist`);
  }

  if (bookInBorrowBook?.status === "BORROWED") {
    throw new Error(`Book ${bookInBorrowBook?.title} is not available`);
  }

  const borrowDate = new Date();
  const returnDate = new Date(borrowDate);
  returnDate.setDate(returnDate.getDate() + 30);

  const borrowHistory = await BorrowHistory.create({
    userId,
    bookId: id,
    borrowDate,
    returnDate,
  });
  console.log("checking borrow history", borrowHistory);
  const result = await Book.update(
    { status: "BORROWED" },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  );


  return result;
};

export const returnBookService = async (id) => {

  console.log('id', id);
  const checkBookStatus = await Book.findOne( {where:{id}});
  console.log('checkBookStatus', checkBookStatus);
  if(checkBookStatus?.status === "AVAILABLE"){
    throw new Error(`Book already available, incorrect Book name`)
  }
  const result = await Book.update(
    { status: "AVAILABLE" },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  );

  return result;
};
