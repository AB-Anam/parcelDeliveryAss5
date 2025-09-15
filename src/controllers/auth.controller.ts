import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { allowedRoles, RoleType } from "../types/roles";

// Interface for registration body
interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role: RoleType;
}

// Interface for login body
interface LoginBody {
  email: string;
  password: string;
}

// ===================== REGISTER =====================
export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await AuthService.registerUser(name, email, password, role);
    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ===================== LOGIN =====================
export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const token = await AuthService.loginUser(email, password);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

// ===================== GET ME (OPTIONAL) =====================
// Example: return logged-in user info
export const getMe = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user; // added by protect middleware
    res.status(200).json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
