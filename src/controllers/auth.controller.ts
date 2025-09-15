import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { allowedRoles, RoleType } from "../types/roles";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role: RoleType;
}

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await AuthService.registerUser(name, email, password, role);
    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
