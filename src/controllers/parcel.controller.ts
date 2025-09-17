import { Request, Response } from "express";
import * as ParcelService from "../services/parcel.service";

export const createParcel = async (req: Request, res: Response) => {
  try {
    const parcel = await ParcelService.createParcel(req.body, req.user.id);
    res.status(201).json({ success: true, parcel });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyParcels = async (req: Request, res: Response) => {
  try {
    const parcels = await ParcelService.getParcelsForUser(req.user.id, req.user.role);
    res.json({ success: true, parcels });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};



export const cancelParcel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelService.cancelParcel(id, req.user.id);
    res.json({ success: true, parcel });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const confirmDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelService.confirmDelivery(id, req.user.id);
    res.json({ success: true, parcel });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin
export const updateParcelStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const parcel = await ParcelService.adminUpdateStatus(id, status, note, req.user.id);
    res.json({ success: true, parcel });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const blockParcel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { blocked } = req.body;
    const parcel = await ParcelService.toggleParcelBlock(id, blocked);
    res.json({ success: true, parcel });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const trackParcel = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params;
    const parcel = await ParcelService.trackParcelById(trackingId);
    res.json({ success: true, parcel });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const getAllParcels = async (req: Request, res: Response) => {
  try {
    const parcels = await ParcelService.getParcelsForUser(req.user.id, "admin");
    res.json({ success: true, parcels });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get Delivery History for a Parcel
export const getParcelHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelService.getParcelHistory(id, req.user.id, req.user.role);
    res.json({ success: true, trackingEvents: parcel.trackingEvents });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
