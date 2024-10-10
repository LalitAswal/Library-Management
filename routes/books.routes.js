import express from "express";
import {
  allBooksList,
  addBook,
  updateBook,
  deleteBook,
  borrowBooks,
  returnBook,
} from "../controllers/books.controller.js";
import { userAuth } from "../middleware/auth.js";
const router = express.Router();

import { checkPermission } from "../middleware/roleMiddleWare.js";
  // librarian: ["viewbooks", "create", "update", "delete", "viewall"],
router.get("/", userAuth,checkPermission('viewAll'), allBooksList);
router.post("/",userAuth,checkPermission('create'), addBook);
router.put("/:id",userAuth,checkPermission('update'), updateBook);
router.delete("/:id",userAuth,checkPermission('viewall'), deleteBook);
// books borrow sections
// history of all the


router.post("/borrowBook",userAuth,checkPermission('borrow'), borrowBooks);
router.post("/returnBook/:id",userAuth,checkPermission('return'), returnBook);

export default router;
