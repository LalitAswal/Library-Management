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

export const userRegistrationService = async (userName, password) => {
  const existingUser = await User.findOne({ where: { username: userName } });
  if (existingUser?.dataValues) {
    throw new Error('Username already taken');
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.JWT_SALT_ROUNDS));

  const newUser = await User.create({
    username: userName,
    password: hashedPassword,
  });
  return newUser?.id;
};

export const loginUserService = async (userName, password) => {
  const user = await User.findOne({ where: { username: userName } });
  if (!user) {
    console.error('Incorrect username');
    throw new Error(`Incorrect username and password`);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.error('Incorrect password');
    throw new Error(`Incorrect username and password`);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return token;
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
    console.log('checking file path service');

    // Parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        users.push({
          username: row.username,
          password: row.password,
          role: row.role || 'member',
          token: row.token || null,
        });
      })
      .on('end', async () => {
        try {
          // Bulk insert into the database
          await User.bulkCreate(users);

          // Cleanup the uploaded file
          fs.unlinkSync(filePath);

          resolve({ success: true, count: users.length });
        } catch (error) {
          console.error('Error inserting users:', error.message);
          reject(new Error('Failed to add users to the database'));
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error.message);
        reject(new Error('Error reading CSV file'));
      });
  });
};
