import {
  deleteUserService,
  loginUserService,
  userRegistrationService,
  getAllUsersService,
  userUpdateService,
  userDetailsService,
  bulkAddUserService,
  userBorrowedBookListService,
  refreshTokenService,
} from '../service/user.service.js';

export const registration = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    if (!userName || !password) {
      throw new Error('incorrect  Details');
    }
    await userRegistrationService(userName, password, email);
    res.status(200).json({
      message: 'user Register Successfully',
    });
  } catch (error) {
    console.log('checking error message', error);
    res.status(409).json({
      message: error?.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      throw new Error('Incorrect userName and password');
    }

    const token = await loginUserService(userName, password);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'User logged in successfully',
      userName,
    });
  } catch (error) {
    return res.status(401).json({
      message: error?.message,
    });
  }
};

export const signOut = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      const user = await User.findByPk(decoded.id);

      if (user) {
        user.token = null;
        await user.save();
      }
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};

export const refreshTokenHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const { newAccessToken, newRefreshToken } = await refreshTokenService(refreshToken);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    return res.status(403).json({
      message: error.message || 'Invalid or expired refresh token',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error('invalid id');
    }
    const result = await deleteUserService(id);
    res.status(200).json({
      message: 'user deleted successfully',
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
      message: 'All users fetched successfully',
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
    const id = req.user;
    const { username, role } = req.body;
    const result = await userUpdateService(id, username, role);
    res.status(201).json({
      message: 'user Details update successfully',
      response: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const userBorrowedBookList = async (req, res) => {
  try {
    const id = req.user;
    const { username, role } = req.body;

    const result = await userBorrowedBookListService(id, username, role);
    res.status(201).json({
      message: 'user Details update successfully',
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
    const id = req?.user;
    const result = await userDetailsService(id);
    return res.status(200).json({
      message: 'user Details fetch successfully',
      response: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addBulkUser = async (req, res) => {
  try {
    const filePath = req?.file?.path ?? '';
    console.log('checking file path', req);

    if (!filePath) {
      throw new Error('file not found');
    }

    const result = await bulkAddUserService(filePath);

    console.log('checking result', result);

    return res.status(200).json({
      message: 'Users added successfully',
      response: result,
    });
  } catch (error) {
    console.error('Error adding bulk users:', error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};
