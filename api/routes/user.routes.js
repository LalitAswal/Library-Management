import express from 'express';
import {
  login,
  registration,
  signOut,
  deleteUser,
  getAllUsers,
  getUserDetails,
  userUpdate,
  addBulkUser,
  userBorrowedBookList,
  refreshTokenHandler,
} from '../controllers/user.controller.js';
import { userAuth } from '../middleware/auth.js';
import { checkPermission } from '../middleware/roleMiddleWare.js';
const router = express.Router();

// file upload
import multer from 'multer';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage });

// user routes
router.post('/register', registration);
router.post('/login', login);
router.post('/singOut', signOut);
router.post('/refreshToken', refreshTokenHandler);
router.get('/profile', userAuth, getUserDetails);
router.post('/userUpdate', userAuth, checkPermission('update'), userUpdate);
router.get('/borrowedBookList', userAuth, checkPermission('viewAll'), userBorrowedBookList);

// admin routes
router.get('/', getAllUsers);
router.post('/bulkAddUser', upload.single('file'), addBulkUser); // add bulk user
router.delete('/:id', userAuth, checkPermission('deleteDate'), deleteUser);

export default router;
