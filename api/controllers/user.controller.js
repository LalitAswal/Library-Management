import {
  deleteUserService,
  loginUserService,
  userRegistrationService,
  getAllUsersService,
  userUpdateService,
  userDetailsService,
  bulkAddUserService,
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
    console.log("req.body for login===>", req.body);

    if (!userName || !password) {
      throw new Error("Incorrect userName and password");
    }

    const result = await loginUserService(userName, password);
    console.log("checking34234234", result);
    return res.status(200).json({
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

    return res.status(200).json({
      message: "All users fetched successfully",
      response: result,
    });
  } catch (error) {
    return res.status(409).json({
      message: error?.message,
    });
  }
};

export const userUpdate = async (req, res) => {
  try {
    const { id } = req?.params ?? "";
    const { username, role } = req.body;
    const result = await userUpdateService(id, username, role);
    res.status(201).json({
      message: "user Details update successfully",
      response: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req?.params ?? "";
    console.log("checkkg id", id);
    const result = await userDetailsService(id);
    return res.send(200).json({
      message: "user Details fetch successfully",
      response: result,
    });
  } catch (error) {
    return res.send(500).json({
      message: error.message,
    });
  }
};

export const addBulkUser = async (req, res) => {
  try {
    const filePath = req?.file?.path ?? "";
    console.log('checking file path', req);

    if (!filePath) {
      throw new Error("file not found");
    }

    const result = await bulkAddUserService(filePath);

    console.log('checking result', result);

    return res.status(200).json({
      message: "Users added successfully",
      response: result,
    });
  } catch (error) {
    console.error("Error adding bulk users:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};
