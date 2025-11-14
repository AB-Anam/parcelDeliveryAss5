//src/controllers/parcel.controller.ts
import { Request, Response } from "express";
import * as ParcelService from "../services/parcel.service";

// ---------------------------------------------------
// 📨 Create a new parcel (Sender only)
// ---------------------------------------------------
export const createParcelController = async (req: Request, res: Response) => {
  try {
    console.log("📦 Creating parcel:", req.body);
    const parcel = await ParcelService.createParcel(req.body, req.user.id);
    res.status(201).json({ success: true, parcel });
  } catch (error: any) {
    console.error("❌ Error creating parcel:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// 🚚 Deliver a parcel (assign receiver) — Sender only
// ---------------------------------------------------
export const deliverParcelController = async (req: Request, res: Response) => {
  try {
    const { parcelId, receiverId } = req.body;
    if (!parcelId || !receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "parcelId and receiverId are required" });
    }

    const parcel = await ParcelService.deliverParcel(parcelId, req.user.id, receiverId);
    res.json({ success: true, parcel });
  } catch (error: any) {
    console.error("❌ Error delivering parcel:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// 📦 Get parcels for current user (Sender / Receiver)
// ---------------------------------------------------
export const getMyParcelsController = async (req: Request, res: Response) => {
  try {
    const parcels = await ParcelService.getParcelsForUser(req.user.id, req.user.role);
    res.json({ success: true, parcels });
  } catch (error: any) {
    console.error("❌ Error fetching parcels:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// ❌ Cancel a parcel (Sender only)
// ---------------------------------------------------
export const cancelParcelController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelService.cancelParcel(id, req.user.id);
    res.json({ success: true, parcel });
  } catch (error: any) {
    console.error("❌ Error canceling parcel:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// ✅ Confirm delivery (Receiver only)
// ---------------------------------------------------
export const confirmDeliveryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await ParcelService.confirmDelivery(id, req.user.id);
    res.json({ success: true, parcel });
  } catch (error: any) {
    console.error("❌ Error confirming delivery:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// 👑 Admin: Update parcel status
// ---------------------------------------------------
export const updateParcelStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const parcel = await ParcelService.adminUpdateStatus(id, status, note, req.user.id);
    res.json({ success: true, parcel });
  } catch (error: any) {
    console.error("❌ Error updating parcel status:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// 👑 Admin: Block or unblock parcel
// ---------------------------------------------------
export const blockParcelController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { blocked } = req.body;
    const parcel = await ParcelService.toggleParcelBlock(id, blocked);
    res.json({ success: true, parcel });
  } catch (error: any) {
    console.error("❌ Error blocking parcel:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// 👑 Admin: Get all parcels
// ---------------------------------------------------
export const getAllParcelsController = async (req: Request, res: Response) => {
  try {
    const parcels = await ParcelService.getParcelsForUser(req.user.id, "admin");
    res.json({ success: true, parcels });
  } catch (error: any) {
    console.error("❌ Error fetching all parcels:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// 🌍 Public: Track parcel by tracking ID
// ---------------------------------------------------
export const trackParcelController = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params;
    const parcel = await ParcelService.trackParcelById(trackingId);
    res.json({ success: true, parcel });
  } catch (error: any) {
    console.error("❌ Error tracking parcel:", error.message);
    res.status(404).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------
// 📜 Get delivery history for a parcel (Sender/Receiver)
// ---------------------------------------------------
export const getParcelHistoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const events = await ParcelService.getParcelHistory(id);
    res.json({ success: true, trackingEvents: events });
  } catch (error: any) {
    console.error("❌ Error fetching parcel history:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
