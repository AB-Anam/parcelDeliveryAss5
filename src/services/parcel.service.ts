import Parcel from "../models/parcel.model";
import User from "../models/user.model";
import { Types } from "mongoose";
import crypto from "crypto";

// Generate tracking ID
const generateTrackingId = (): string => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `TRK-${date}-${random}`;
};

// Valid status transitions
const STATUS_FLOW: Record<string, string[]> = {
  Requested: ["Pending Approval", "Canceled"],
  "Pending Approval": ["Dispatched", "Canceled"],
  Dispatched: ["On The Way", "Canceled"],
  "On The Way": ["Delivered"],
  Delivered: [],
  Canceled: [],
};

// Validate transition
const validateStatusTransition = (current: string, next: string) => {
  const allowed = STATUS_FLOW[current] || [];
  if (!allowed.includes(next)) {
    throw new Error(`Invalid transition: ${current} → ${next}`);
  }
};

/* ----------------------------------------------------------------
   📦 CREATE PARCEL (Sender)
---------------------------------------------------------------- */
export const createParcel = async (data: any, senderId: string) => {
  const fee = data.weight * 10;

  const parcel = await Parcel.create({
    type: data.type,
    weight: data.weight,
    senderId: new Types.ObjectId(senderId),
    receiverId: new Types.ObjectId(), // placeholder, will be replaced later
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

/* ----------------------------------------------------------------
   🚚 DELIVER PARCEL (assign receiver)
---------------------------------------------------------------- */
export const deliverParcel = async (
  parcelId: string,
  senderId: string,
  receiverId: string
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  if (parcel.senderId.toString() !== senderId)
    throw new Error("You cannot deliver someone else's parcel");

  parcel.receiverId = new Types.ObjectId(receiverId);
  parcel.status = "Pending Approval";

  parcel.trackingEvents.push({
    status: "Pending Approval",
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(senderId),
    note: "Receiver assigned, waiting admin approval",
  });

  await parcel.save();
  return parcel;
};

/* ----------------------------------------------------------------
   📬 GET PARCELS FOR USER
---------------------------------------------------------------- */
export const getParcelsForUser = async (userId: string, role: string) => {
  if (role === "admin") return Parcel.find().sort({ createdAt: -1 });

  if (role === "sender")
    return Parcel.find({ senderId: new Types.ObjectId(userId) }).sort({
      createdAt: -1,
    });

  if (role === "receiver")
    return Parcel.find({ receiverId: new Types.ObjectId(userId) }).sort({
      createdAt: -1,
    });

  return [];
};

/* ----------------------------------------------------------------
   ❌ CANCEL PARCEL
---------------------------------------------------------------- */
export const cancelParcel = async (parcelId: string, userId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  if (parcel.senderId.toString() !== userId)
    throw new Error("Only the sender can cancel parcel");

  validateStatusTransition(parcel.status, "Canceled");

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

/* ----------------------------------------------------------------
   📦 RECEIVER CONFIRM DELIVERY
---------------------------------------------------------------- */
export const confirmDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  if (parcel.receiverId.toString() !== receiverId)
    throw new Error("This parcel does not belong to you");

  validateStatusTransition(parcel.status, "Delivered");

  parcel.status = "Delivered";

  parcel.trackingEvents.push({
    status: "Delivered",
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(receiverId),
    note: "Parcel received by the receiver",
  });

  await parcel.save();
  return parcel;
};

/* ----------------------------------------------------------------
   👑 ADMIN UPDATE STATUS
---------------------------------------------------------------- */
export const adminUpdateStatus = async (
  parcelId: string,
  status: string,
  note: string,
  adminId: string
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  validateStatusTransition(parcel.status, status);

  parcel.status = status;
  parcel.trackingEvents.push({
    status,
    timestamp: new Date(),
    updatedBy: new Types.ObjectId(adminId),
    note: note || "",
  });

  await parcel.save();
  return parcel;
};

/* ----------------------------------------------------------------
   👑 BLOCK / UNBLOCK
---------------------------------------------------------------- */
export const toggleParcelBlock = async (parcelId: string, blocked: boolean) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  parcel.status = blocked ? "Blocked" : "Requested";

  parcel.trackingEvents.push({
    status: parcel.status,
    timestamp: new Date(),
    note: blocked ? "Parcel blocked by admin" : "Parcel unblocked",
  });

  await parcel.save();
  return parcel;
};

/* ----------------------------------------------------------------
   🌍 TRACK PARCEL
---------------------------------------------------------------- */
export const trackParcelById = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId });
  if (!parcel) throw new Error("Parcel not found");
  return parcel;
};

/* ----------------------------------------------------------------
   📜 GET PARCEL HISTORY
---------------------------------------------------------------- */
export const getParcelHistory = async (parcelId: string) => {
  const parcel = await Parcel.findById(parcelId).select("trackingEvents");
  if (!parcel) throw new Error("Parcel not found");
  return parcel.trackingEvents;
};
