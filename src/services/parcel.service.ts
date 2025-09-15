import Parcel, { IParcel, ParcelStatus } from "../models/parcel.model";
import { generateTrackingId } from "../utils/tracking.util";
import mongoose from "mongoose";

export const createParcel = async (data: Partial<IParcel>, senderId: string) => {
  const trackingId = generateTrackingId();
  const parcel = await Parcel.create({
    ...data,
    trackingId,
    sender: senderId,
    status: "Requested",
    statusLogs: [
      {
        status: "Requested",
        note: "Parcel created",
        updatedBy: new mongoose.Types.ObjectId(senderId),
      },
    ],
  });
  return parcel;
};

export const getParcelsForUser = async (userId: string, role: string) => {
  let query: any = {};
  if (role === "sender") query.sender = userId;
  else if (role === "receiver") query["receiver.email"] = (await Parcel.findById(userId))?.receiver.email; // optional
  const parcels = await Parcel.find(query).sort({ createdAt: -1 });
  return parcels;
};

export const cancelParcel = async (parcelId: string, userId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");
  if (parcel.sender.toString() !== userId) throw new Error("Not owner");
  if (["Dispatched", "In Transit", "Delivered"].includes(parcel.status))
    throw new Error("Cannot cancel dispatched/in-transit/delivered parcel");
  parcel.status = "Cancelled";
  parcel.statusLogs.push({
    status: "Cancelled",
    note: "Cancelled by sender",
    updatedBy: new mongoose.Types.ObjectId(userId),
  });
  await parcel.save();
  return parcel;
};

export const confirmDelivery = async (parcelId: string, userId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");
  if (parcel.status === "Delivered") throw new Error("Already delivered");
  parcel.status = "Delivered";
  parcel.statusLogs.push({
    status: "Delivered",
    note: "Confirmed by receiver",
    updatedBy: new mongoose.Types.ObjectId(userId),
  });
  await parcel.save();
  return parcel;
};

// Admin updates
export const adminUpdateStatus = async (
  parcelId: string,
  status: ParcelStatus,
  note: string,
  updatedBy: string
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");
  parcel.status = status;
  parcel.statusLogs.push({
    status,
    note,
    updatedBy: new mongoose.Types.ObjectId(updatedBy),
  });
  await parcel.save();
  return parcel;
};

export const toggleParcelBlock = async (parcelId: string, blocked: boolean) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");
  parcel.blocked = blocked;
  await parcel.save();
  return parcel;
};

export const trackParcelById = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId }).select("-__v");
  if (!parcel) throw new Error("Parcel not found");
  return { trackingId: parcel.trackingId, status: parcel.status, statusLogs: parcel.statusLogs };
};
