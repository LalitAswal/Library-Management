import {
  deleteUserService,
  loginUserService,
  userRegistrationService,
  getAllUsersService,
  // userUpdateService
} from "../service/user.service.js";

export const registration = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      throw new Error("incorrect  Details");
    }
    await userRegistrationService(userName, password);
    res.status(200).json({
      message: "user Register Successfully",
    });
  } catch (error) {
    console.log("checking error message", error);
    res.status(409).json({
      message: error?.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log('req.body for login===>',req.body)

    if (!userName || !password) {
      throw new Error("Incorrect userName and password");
    }

    const result = await loginUserService(userName, password);
    res.status(200).json({
      message: "user Register Successfully",
      token: result,
    });
  } catch (error) {
    res.status(409).json({
      message: error?.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("invalid id");
    }
    const result = await deleteUserService(id);
    res.status(200).json({
      message: "user deleted successfully",
      token: result,
    });
  } catch (error) {
    res.status(409).json({
      message: error?.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await getAllUsersService();
    res.status(200).json({
      message: "All users fetched successfully",
      response: result,
    });
  } catch (error) {
    res.status(409).json({
      message: error?.message,
    });
  }
};

// export const userUpdate = async (req, res) => {
//   const {id} = req?.params ?? "";
//   const result= await userUpdateService(id);
//   res.status(200).json({
//     message: "user Details update successfully",
//     response: result,
//   });
// }
