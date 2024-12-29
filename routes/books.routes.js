import express from "express";
import {
  allBooksList,
  addBook,
  updateBook,
  deleteBook,
  borrowBooks,
  returnBook,
  searchBook,
  bulkBookUpload
} from "../controllers/books.controller.js";
import { userAuth } from "../middleware/auth.js";
const router = express.Router();

import { checkPermission } from "../middleware/roleMiddleWare.js";

import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads"; 

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

const upload = multer({storage});

// user routes
router.get("/", userAuth,checkPermission('viewAll'), allBooksList);
router.post("/borrowBook",userAuth,checkPermission('borrow'), borrowBooks);
router.post("/returnBook/:id",userAuth,checkPermission('return'), returnBook);
router.post("/searchBook",userAuth,checkPermission("viewBooks"), searchBook)


// admin routes

router.post("/",userAuth,checkPermission('create'), addBook);
router.put("/:id",userAuth,checkPermission('update'), updateBook);
router.delete("/:id",userAuth,checkPermission('viewAll'), deleteBook);
router.post("/bulkAddBook",upload.single("file"), bulkBookUpload);


export default router;
