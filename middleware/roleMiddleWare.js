const rolePermission = {
  member: ["viewbooks", "borrow", "return"],
  librarian: ["viewbooks", "create", "update", "deletedate", "viewall"],
};

export const checkPermission = (requiredPermission) => (req, res, next) => {
  console.log("rolePermission", requiredPermission);
  const userRole = req.role ?? "";
  console.log("rolePermission[userRole?.toLowerCase()]",rolePermission[userRole?.toLowerCase()])
  console.log("requiredPermission?.toLowerCase()",requiredPermission?.toLowerCase())
  if (
    rolePermission[userRole?.toLowerCase()].includes(
        requiredPermission?.toLowerCase()
    )
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Forbidden: you don't have required permissions" });
};
