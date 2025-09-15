import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await AuthService.registerUser(name, email, password, role);
    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getUserById(req.user.id);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
