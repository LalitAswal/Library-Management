import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../database/userdb.js';
//env
import dotenv from 'dotenv';
dotenv.config();

//for file read-write
import fs from 'fs';
import csvParser from 'csv-parser';
import Book from '../database/booksdb.js';
import BorrowHistory from '../database/borrowHistorydb.js';
import { USER_ROLE, DEFAULT_USER_ROLE } from '../../constants.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

export const userRegistrationService = async (userName, password, email) => {
  const existingUser = await User.findOne({ where: { username: userName } });
  if (existingUser?.dataValues) {
    throw new Error('Username already taken');
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.JWT_SALT_ROUNDS));

  const newUser = await User.create({
    username: userName,
    password: hashedPassword,
    email: email,
  });
  return newUser?.id;
};

export const loginUserService = async (userName, password) => {
  const user = await User.findOne({ where: { username: userName } });

  if (!user) throw new Error('Incorrect username and password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Incorrect username and password');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token in DB
  user.token = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token missing');
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.token !== refreshToken) {
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.token = newRefreshToken;
  await user.save();

  return {
    newAccessToken,
    newRefreshToken,
  };
};

export const deleteUserService = async (id) => {
  const result = await User.update(
    { isDeleted: true },
    {
      where: {
        id,
        role: 'member',
      },
      returning: true,
    }
  );
  if (!result || result[1].length === 0) {
    throw new Error(`no member found with ${id}`);
  }
  return result;
};

export const getAllUsersService = async () => {
  const result = await User.findAll({
    where: {
      role: 'member',
    },
  });

  console.log('checking result', result);
  if (result.length < 1) {
    throw new Error(`no member list found `);
  }
  return result;
};

export const userBorrowedBookListService = async (userId) => {
  const result = await BorrowHistory.findAll({
    where: { userId },
    include: [
      {
        model: Book,
        attributes: ['title', 'author'],
      },
    ],
  });

  if (!result || result.length < 1) {
    throw new Error('No borrowed books found for this user.');
  }

  return result;
};

export const userUpdateService = async (id, username, role) => {
  let updateData = {};
  if (username) {
    updateData.username = username;
  }

  if (role) {
    updateData.role = role;
  }
  const result = await User.update(
    { updateData },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  );

  return result;
};

export const userDetailsService = async (id) => {
  const userDetails = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });

  if (!userDetails) {
    throw new Error("User doesn't exist");
  }
  return userDetails;
};

export const bulkAddUserService = (filePath) => {
  return new Promise((resolve, reject) => {
    const users = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (row) => {
        try {
          let role = DEFAULT_USER_ROLE;

          if (row.role) {
            const roleValue = row.role.toString().toLowerCase();

            if (roleValue === 'member' || roleValue === 1) {
              role = USER_ROLE.MEMBER;
            } else if (roleValue === 'librarian' || roleValue === 2) {
              role = USER_ROLE.LIBRARIAN;
            }
          }

          const hashedPassword = await bcrypt.hash(row.password, 10);

          users.push({
            username: row.username.trim(),
            password: hashedPassword,
            role,
            token: row.token || null,
          });
        } catch (err) {
          console.error('Skipping invalid row:', row);
        }
      })
      .on('end', async () => {
        try {
          await User.bulkCreate(users, {
            validate: true,
            ignoreDuplicates: true, // optional (if username is unique)
          });

          fs.unlinkSync(filePath);

          resolve({
            success: true,
            inserted: users.length,
          });
        } catch (error) {
          console.error('Bulk insert error:', error);
          reject(new Error('Failed to bulk insert users'));
        }
      })
      .on('error', (error) => {
        reject(new Error('Error reading CSV file'));
      });
  });
};
