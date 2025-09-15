import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RoleType, allowedRoles } from "../types/roles"; // import your RoleType

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    // Validate role
    if (!allowedRoles.includes(decoded.role as RoleType)) {
      return res.status(401).json({ success: false, message: "Invalid user role" });
    }

    req.user = { id: decoded.id, role: decoded.role as RoleType }; // cast to RoleType
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
