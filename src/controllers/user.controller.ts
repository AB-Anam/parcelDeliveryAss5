import { Request, Response } from "express";
import * as UserService from "../services/user.service";

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.listUsers();
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { blocked } = req.body;
    const user = await UserService.toggleUserBlock(id, blocked);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
