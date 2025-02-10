import Book from "../database/booksdb.js";
import BorrowHistory from "../database/borrowHistorydb.js";
import fs from "fs";
import csvParser from "csv-parser";


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

export const searchBookService = async (title="", author="", status="")=>{

  const query = {};
  console.table(title, author, status, id)
  if(title){
    query.title =title
  }
   if(author){
    query.author=author
  }
   if (status){
    query.status = status
  }
  if(id){
    query.id = id
  }

  const result = await Book.findAll({query})

  return result

}

export const bulkBookUploadService = async (bulkData) => {
  return new Promise((resolve, reject) => {
    const books = [];

    console.log("checking file path service book service", bulkData);

    // Assuming bulkData is the file path, use fs.createReadStream to read the file
    fs.createReadStream(bulkData)
      .pipe(csvParser())
      .on("data", (row) => {
        console.log("checking row", row);

        // Assuming the CSV columns match these keys exactly
        books.push({
          title: row.title,
          author: row.author,
          status: row.status || "AVAILABLE",  // Default value if status is not provided
          isDeleted: row.isDeleted || false,  // Default value if isDeleted is missing
        });
      })
      .on("end", async () => {
        try {
          console.log("checking books", books);

          // Check if the books array is empty
          if (books.length === 0) {
            reject(new Error("No books data found in the CSV file"));
            return;
          }

          // Bulk insert into the database (ensure your model accepts these fields)
          await Book.bulkCreate(books);
          console.log("Books inserted successfully");

          // Cleanup the uploaded file after processing
          fs.unlinkSync(bulkData); // Assuming `bulkData` is the full file path

          resolve({ success: true, count: books.length });
        } catch (error) {
          console.error("Error inserting books:", error.message);
          reject(new Error("Failed to add books to the database"));
        }
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error.message);
        reject(new Error("Error reading CSV file"));
      });
  });
};


export const bookDetailsService = async (id)=>{

  const bookDetails = await Book.findOne({where:{id}});
  return bookDetails;
}
