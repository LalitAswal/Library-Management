import express from 'express';
import {
  allBooksList,
  addBook,
  updateBook,
  deleteBook,
  borrowBooks,
  returnBook,
  searchBook,
  bulkBookUpload,
  bookDetails,
} from '../controllers/books.controller.js';
import { userAuth } from '../middleware/auth.js';
const router = express.Router();

import { checkPermission } from '../middleware/roleMiddleWare.js';

import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';

    // Create the folder if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// user routes
router.get('/', userAuth, checkPermission('viewAll'), allBooksList);
router.post('/borrowBook', userAuth, checkPermission('borrow'), borrowBooks);
router.post('/returnBook/:id', userAuth, checkPermission('return'), returnBook);
router.get('/searchBook', userAuth, checkPermission('viewBooks'), searchBook);
router.get('/bookDetails/:id', userAuth, checkPermission('viewBooks'), bookDetails);

// admin routes
router.post('/', userAuth, checkPermission('create'), addBook);
router.put('/:id', userAuth, checkPermission('updateBook'), updateBook);
router.delete('/:id', userAuth, checkPermission('deleteDate'), deleteBook);
router.post('/bulkAddBook', upload.single('file'), checkPermission('updateBook'), bulkBookUpload);

export default router;
