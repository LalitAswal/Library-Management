const rolePermission = {
  member: ["viewBooks", "borrow", "return"],
  librarian: ["viewBooks", "create", "update", "deleteDate", "viewAll"],
};

export const checkPermission = (requiredPermission) => (req, res, next) => {
  const userRole = req.role ?? "";
  if (
    rolePermission[userRole?.toLowerCase()].includes(
        requiredPermission
    )
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Forbidden: you don't have required permissions" });
};
