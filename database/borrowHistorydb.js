import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userdb.js";
import Book from "./booksdb.js";


// book return field // userId in array // books count as it can be multiple books 

const BorrowHistory = sequelize.define(
  "borrowHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: "id",
      },
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "borrow_history",
    timestamps: true,
  }
);

User.hasMany(BorrowHistory, { foreignKey: "userId" });
Book.hasMany(BorrowHistory, { foreignKey: "bookId" });
BorrowHistory.belongsTo(User, { foreignKey: "userId" });
BorrowHistory.belongsTo(Book, { foreignKey: "bookId" });

export default BorrowHistory;
