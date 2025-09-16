import { Request, Response } from "express";
import * as UserService from "../services/user.service";

// List all users (Admin only)
export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.listUsers();
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// List only receivers
export const listReceivers = async (_req: Request, res: Response) => {
  try {
    const receivers = await UserService.listReceivers();
    res.json({ success: true, receivers });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
// List only senders
export const listSenders = async (_req: Request, res: Response) => {
  try {
    const senders = await UserService.listSenders();
    res.json({ success: true, senders });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Block/unblock user
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

// see all blocked users

export const listBlockedUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.listBlockedUsers();
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};