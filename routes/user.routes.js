import express from "express";
import {
  login,
  registration,
  deleteUser,
  getAllUsers,
//   userUpdate,
} from "../controllers/user.controller.js";
import { userAuth } from "../middleware/auth.js";
import { checkPermission } from "../middleware/roleMiddleWare.js";
const router = express.Router();
// member: ["viewbooks", "borrow", "return"],

  //   librarian: ["viewbooks", "create", "update", "delete", "viewall"],

  // 

router.post("/register", registration);

router.post("/login", login);
router.get("/", userAuth,checkPermission("viewbooks"),getAllUsers);
// TODO update user left
// router.post("/admin/login", adminLogin);
// router.post("/userUpdate/:id", userUpdate);
router.delete("/:id",userAuth,checkPermission("deletedate"), deleteUser);

export default router;
