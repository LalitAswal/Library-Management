import { firebaseRegistrationService } from '../service/notification.service.js';

export const firebaseRegistrationUser = async (req, res) => {
  try {
    const userId = req.user;
    const { firebaseToken, role } = req.body;

    console.log('Checking working of firebaseRegistrationToken API');

    const result = await firebaseRegistrationService({ userId, firebaseToken, role });

    return res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    console.error('Error registering token:', error);
    return res.status(500).json({
      message: error.message || 'Internal Server Error',
    });
  }
};
