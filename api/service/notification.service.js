import Notification from '../database/notificationdb.js';

export const firebaseRegistrationService = async ({ userId, firebaseToken, role }) => {
  if (!firebaseToken || typeof userType !== 'number') {
    throw new Error('Invalid token or user type');
  }

  const existingUser = await Notification.findOne({
    where: {
      userId,
      userType,
    },
  });

  if (existingUser) {
    await Notification.update(
      { firebaseToken },
      {
        where: {
          userId,
          role,
        },
      }
    );

    return { message: 'Token updated successfully' };
  } else {
    await Notification.create({ firebaseToken, userId, role });
    return { message: 'Token registered successfully' };
  }
};
