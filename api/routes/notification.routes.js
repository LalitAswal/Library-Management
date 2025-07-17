import express from 'express';
import { userAuth } from '../middleware/auth.js';

const router = express.Router();

const { firebaseRegistrationUser } = require('../controllers/notification.controller.js');

router.post('/firebaseRegistrationUser', userAuth, firebaseRegistrationUser);

module.exports = router;
