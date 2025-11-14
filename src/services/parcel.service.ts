import Parcel from "../models/parcel.model";
import User from "../models/user.model";
import { Types } from "mongoose";
import crypto from "crypto";

// --------------------------
// Utility: Generate Tracking ID
// --------------------------
const generateTrackingId = (): string => {
  const datePart = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `TRK-${datePart}-${randomPart}`;
};

// --------------------------
// Create Parcel (no receiver yet)
// --------------------------
export const createParcel = async (data: any, senderId: string) => {
  const fee = data.weight * 10;

  const parcel = await Parcel.create({
    type: data.type,
    weight: data.weight,
    senderId: new Types.ObjectId(senderId),
    pickupAddress: data.pickupAddress,
    deliveryAddress: data.deliveryAddress,
    fee,
    status: "Requested",
    trackingId: generateTrackingId(),
    trackingEvents: [
      {
        status: "Requested",
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(senderId),
        note: "Parcel created by sender",
      },
    ],
  });

  return parcel;
};

// --------------------------
// Deliver Parcel (assign receiver)
// --------------------------
export const deliverParcel = async (parcelId: string, senderId: string, receiverId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  if (parcel.senderId.toString() !== senderId)
    throw new Error("You can only deliver your own parcels");

  if (parcel.receiverId)
    throw new Error("Receiver already assigned for this parcel");

  const receiver = await User.findById(receiverId);
  if (!receiver || receiver.role !== "receiver")
    throw new Error("Invalid receiver ID");

  parcel.receiverId = receiver._id;
  parcel.status = "Approved";
  parcel.trackingEvents.push({
    status: "Approved",
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(senderId),
    note: "Receiver assigned and parcel approved for dispatch",
  });

  await parcel.save();
  return parcel;
};

// --------------------------
// Cancel Parcel
// --------------------------
export const cancelParcel = async (parcelId: string, userId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  if (parcel.senderId.toString() !== userId)
    throw new Error("You can only cancel your own parcels");

  parcel.status = "Canceled";
  parcel.trackingEvents.push({
    status: "Canceled",
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(userId),
    note: "Parcel canceled by sender",
  });

  await parcel.save();
  return parcel;
};

// --------------------------
// Confirm Delivery (Receiver)
// --------------------------
export const confirmDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  if (parcel.receiverId?.toString() !== receiverId)
    throw new Error("You can only confirm parcels assigned to you");

  parcel.status = "Delivered";
  parcel.trackingEvents.push({
    status: "Delivered",
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(receiverId),
    note: "Parcel received and confirmed by receiver",
  });

  await parcel.save();
  return parcel;
};

// --------------------------
// Admin: Update Status
// --------------------------
export const adminUpdateStatus = async (parcelId: string, status: string, note: string, adminId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  parcel.status = status;
  parcel.trackingEvents.push({
    status,
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(adminId),
    note,
  });

  await parcel.save();
  return parcel;
};

// --------------------------
// Admin: Block / Unblock Parcel
// --------------------------
export const toggleParcelBlock = async (parcelId: string, blocked: boolean) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  parcel.status = blocked ? "Blocked" : "Requested";
  parcel.trackingEvents.push({
    status: blocked ? "Blocked" : "Unblocked",
    timestamp: new Date(),
    note: blocked ? "Parcel has been blocked by admin" : "Parcel unblocked by admin",
  });

  await parcel.save();
  return parcel;
};

// --------------------------
// Get Parcels (User-specific or Admin)
// --------------------------
export const getParcelsForUser = async (userId: string, role: string) => {
  if (role === "admin") return Parcel.find().populate("senderId receiverId");
  if (role === "sender") return Parcel.find({ senderId: userId }).populate("receiverId");
  if (role === "receiver") return Parcel.find({ receiverId: userId }).populate("senderId");
  throw new Error("Invalid role for parcel fetch");
};

// --------------------------
// Track Parcel (Public)
// --------------------------
export const trackParcelById = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId }).populate("senderId receiverId");
  if (!parcel) throw new Error("Parcel not found");
  return parcel;
};

// --------------------------
// Get Parcel History
// --------------------------
export const getParcelHistory = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");
  return parcel.trackingEvents;
};
