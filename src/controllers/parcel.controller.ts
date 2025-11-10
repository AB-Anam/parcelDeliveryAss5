import { Request, Response } from "express";
import * as ParcelService from "../services/parcel.service";

/**
 * Create a new parcel (Sender only)
 */
export const createParcel = async (req: Request, res: Response) => {
  try {
    console.log("📦 Incoming parcel data:", req.body);

    const parcel = await ParcelService.createParcel(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Parcel created successfully!",
      trackingId: parcel.trackingId,
      fee: parcel.fee,
      parcel,
    });
  } catch (err: any) {
    console.error("❌ Parcel creation failed:", err.message);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create parcel",
    });
  }
};

/**
 * Get parcels for the logged-in user
 */
export const getMyParcels = async (req: Request, res: Response) => {
  try {
    const parcels = await ParcelService.getParcelsForUser(req.user.id, req.user.role);
    res.json({ success: true, parcels });
  } catch (err: any) {
    console.error("❌ Failed to get parcels:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Cancel a parcel (Sender only)
 */
export const cancelParcel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelService.cancelParcel(id, req.user.id);
    res.json({
      success: true,
      message: "Parcel canceled successfully.",
      parcel,
    });
  } catch (err: any) {
    console.error("❌ Cancel parcel error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Confirm parcel delivery (Receiver only)
 */
export const confirmDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelService.confirmDelivery(id, req.user.id);
    res.json({
      success: true,
      message: "Delivery confirmed successfully!",
      parcel,
    });
  } catch (err: any) {
    console.error("❌ Confirm delivery error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Admin - Update parcel status
 */
export const updateParcelStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const parcel = await ParcelService.adminUpdateStatus(id, status, note, req.user.id);
    res.json({
      success: true,
      message: `Parcel status updated to ${status}.`,
      parcel,
    });
  } catch (err: any) {
    console.error("❌ Update parcel status error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Admin - Block or unblock a parcel
 */
export const blockParcel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { blocked } = req.body;
    const parcel = await ParcelService.toggleParcelBlock(id, blocked);
    res.json({
      success: true,
      message: blocked ? "Parcel has been blocked." : "Parcel has been unblocked.",
      parcel,
    });
  } catch (err: any) {
    console.error("❌ Block parcel error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Track parcel publicly using trackingId
 */
export const trackParcel = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params;
    const parcel = await ParcelService.trackParcelById(trackingId);
    res.json({
      success: true,
      message: "Parcel tracking information retrieved successfully.",
      parcel,
    });
  } catch (err: any) {
    console.error("❌ Track parcel error:", err.message);
    res.status(404).json({ success: false, message: err.message });
  }
};

/**
 * Admin - Get all parcels
 */
export const getAllParcels = async (req: Request, res: Response) => {
  try {
    const parcels = await ParcelService.getParcelsForUser(req.user.id, "admin");
    res.json({
      success: true,
      message: "All parcels fetched successfully.",
      parcels,
    });
  } catch (err: any) {
    console.error("❌ Get all parcels error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Get delivery history for a specific parcel
 */
export const getParcelHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelService.getParcelHistory(id, req.user.id, req.user.role);
    res.json({
      success: true,
      message: "Parcel history fetched successfully.",
      trackingEvents: parcel.trackingEvents,
    });
  } catch (err: any) {
    console.error("❌ Get parcel history error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
