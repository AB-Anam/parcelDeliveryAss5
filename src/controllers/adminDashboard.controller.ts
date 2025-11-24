// src/controllers/adminDashboard.controller.ts
import { Request, Response } from "express";
import User from "../models/user.model";
import Parcel from "../models/parcel.model";

export const getAdminDashboard = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().lean();

    const parcels = await Parcel.find().lean();

    const stats = {
      totalUsers: await User.countDocuments(),
      totalParcels: await Parcel.countDocuments(),
      deliveredParcels: await Parcel.countDocuments({ status: "delivered" }),
      inTransitParcels: await Parcel.countDocuments({ status: "in-transit" }),
      blockedParcels: await Parcel.countDocuments({ blocked: true }),
    };

    res.json({
      success: true,
      users,
      parcels,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
