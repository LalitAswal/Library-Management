import { USER_ROLE } from '../../constants.js';

const rolePermission = {
  [USER_ROLE.MEMBER]: ['viewBooks', 'borrow', 'return', 'update', 'viewAll'],
  [USER_ROLE.LIBRARIAN]: ['viewBooks', 'create', 'updateBook', 'deleteDate', 'viewAll'],
};

export const checkPermission = (requiredPermission) => (req, res, next) => {
  const userRole = req.role ?? '';
  if (rolePermission[userRole].includes(requiredPermission)) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: you don't have required permissions" });
};
