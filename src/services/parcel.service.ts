import Parcel from "../models/parcel.model";
import User from "../models/user.model";
import { Types } from "mongoose";

interface CreateParcelDTO {
  type: string;
  weight: number;
  receiverId: string;
  pickupAddress: string;
  deliveryAddress: string;
  fee: number;
}

// ✅ Valid status transitions
const STATUS_FLOW: Record<string, string[]> = {
  Requested: ["Approved", "Canceled"],
  Approved: ["Dispatched", "Canceled"],
  Dispatched: ["In Transit"],
  "In Transit": ["Delivered", "Returned"],
  Delivered: [],
  Canceled: [],
  Blocked: ["Unblocked"],
  Returned: [],
};

// Validate status changes
const validateStatusTransition = (current: string, next: string) => {
  const allowed = STATUS_FLOW[current];
  if (!allowed || !allowed.includes(next)) {
    throw new Error(`Invalid status transition: ${current} → ${next}`);
  }
};

// Generate unique tracking ID
const generateTrackingId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `TRK-${date}-${random}`;
};

// Create a new parcel
export const createParcel = async (data: CreateParcelDTO, senderId: string) => {
  const receiver = await User.findById(data.receiverId);
  if (!receiver) throw new Error("Receiver not found");
  if (receiver.role !== "receiver") throw new Error("Assigned user is not a receiver");

  const parcel = new Parcel({
    type: data.type,
    weight: data.weight,
    senderId: new Types.ObjectId(senderId),
    receiverId: new Types.ObjectId(data.receiverId),
    pickupAddress: data.pickupAddress,
    deliveryAddress: data.deliveryAddress,
    fee: data.fee,
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

  await parcel.save();
  return parcel;
};

// Admin updates parcel status
export const adminUpdateStatus = async (
  parcelId: string,
  newStatus: string,
  note: string,
  adminId: string
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  validateStatusTransition(parcel.status, newStatus);

  parcel.status = newStatus;
  parcel.trackingEvents.push({
    status: newStatus,
    updatedBy: new Types.ObjectId(adminId),
    note: note || `Status updated to ${newStatus} by admin`,
    timestamp: new Date(),
  });

  await parcel.save();
  return parcel;
};

// Get parcels based on role
export const getParcelsForUser = async (
  userId: string,
  role: "sender" | "receiver" | "admin"
) => {
  if (role === "sender") {
    return Parcel.find({ senderId: new Types.ObjectId(userId) }).populate("receiverId");
  } else if (role === "receiver") {
    return Parcel.find({ receiverId: new Types.ObjectId(userId) }).populate("senderId");
  } else if (role === "admin") {
    return Parcel.find().populate("senderId receiverId");
  } else {
    throw new Error("Invalid role for fetching parcels");
  }
};

// Get all parcels (admin)
export const getAllParcels = async () => {
  return Parcel.find().populate("senderId receiverId");
};

// Receiver confirms delivery
export const confirmDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  if (parcel.receiverId.toString() !== receiverId) {
    throw new Error("You are not authorized to confirm this delivery");
  }

  validateStatusTransition(parcel.status, "Delivered");

  parcel.status = "Delivered";
  parcel.trackingEvents.push({
    status: "Delivered",
    updatedBy: new Types.ObjectId(receiverId),
    note: "Receiver confirmed delivery",
    timestamp: new Date(),
  });

  await parcel.save();
  return parcel;
};

// Sender cancels parcel
export const cancelParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  if (parcel.senderId.toString() !== senderId) {
    throw new Error("You are not authorized to cancel this parcel");
  }

  const cancellableStatuses = ["Requested", "Approved"];
  if (!cancellableStatuses.includes(parcel.status)) {
    throw new Error(`Cannot cancel parcel in status: ${parcel.status}`);
  }

  parcel.status = "Canceled";
  parcel.trackingEvents.push({
    status: "Canceled",
    updatedBy: new Types.ObjectId(senderId),
    note: "Parcel canceled by sender",
    timestamp: new Date(),
  });

  await parcel.save();
  return parcel;
};

// Admin blocks/unblocks parcel
export const toggleParcelBlock = async (parcelId: string, blocked: boolean) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  parcel.status = blocked ? "Blocked" : parcel.status;
  await parcel.save();
  return parcel;
};

// Track parcel by trackingId (public)
export const trackParcelById = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId }).populate(
    "senderId receiverId",
    "name email role"
  );
  if (!parcel) throw new Error("Parcel not found");
  return parcel;
};
