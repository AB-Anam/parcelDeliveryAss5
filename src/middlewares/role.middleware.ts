import { Request, Response, NextFunction } from "express";
import { RoleType } from "../types/roles";

export const authorize = (...roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role as RoleType; // Cast to RoleType
    if (!roles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
    }
    next();
  };
};
