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

// Valid status transitions
const STATUS_FLOW: Record<string, string[]> = {
  Requested: ["Approved", "Canceled"],        // Sender creates → can be approved by Admin or canceled by Sender
  Approved: ["Dispatched", "Canceled"],      // Admin approves → can be dispatched or canceled
  Dispatched: ["In Transit"],                 // Parcel handed over → can go in transit
  "In Transit": ["Delivered", "Returned"],   // Delivery in progress → can be delivered or returned
  Delivered: [],                              // Final state
  Canceled: [],                               // Final state
  Blocked: ["Unblocked"],                     // Optional, admin can unblock
  Returned: [],                               // Optional final state
};

const validateStatusTransition = (current: string, next: string) => {
  const allowed = STATUS_FLOW[current];
  if (!allowed || !allowed.includes(next)) {
    throw new Error(`Invalid status transition: ${current} → ${next}`);
  }
};

export const createParcel = async (data: CreateParcelDTO, senderId: string) => {
  // ✅ Check if receiver exists and is a receiver
  const receiver = await User.findById(data.receiverId);
  if (!receiver) {
    throw new Error("Receiver not found");
  }
  if (receiver.role !== "receiver") {
    throw new Error("Assigned user is not a receiver");
  }

  const parcel = new Parcel({
    type: data.type,
    weight: data.weight,
    senderId: new Types.ObjectId(senderId),
    receiverId: new Types.ObjectId(data.receiverId),
    pickupAddress: data.pickupAddress,
    deliveryAddress: data.deliveryAddress,
    fee: data.fee,
    status: "Requested",
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

export const adminUpdateStatus = async (
  parcelId: string,
  newStatus: string,
  note: string,
  adminId: string
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  // Validate transition
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

export const getAllParcels = async () => {
  return Parcel.find().populate("senderId receiverId");
};

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

export const cancelParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  // Check that the logged-in user is the sender
  if (parcel.senderId.toString() !== senderId) {
    throw new Error("You are not authorized to cancel this parcel");
  }

  // Only allow cancellation if the parcel is not yet dispatched or delivered
  const cancellableStatuses = ["Requested", "Approved"];
  if (!cancellableStatuses.includes(parcel.status)) {
    throw new Error(`Cannot cancel parcel in status: ${parcel.status}`);
  }

  // Update status and add tracking log
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

export const toggleParcelBlock = async (parcelId: string, blocked: boolean) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  parcel.status = blocked ? "Blocked" : parcel.status;
  await parcel.save();
  return parcel;
};

// Track parcel by trackingId (Public)
export const trackParcelById = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ _id: trackingId })
    .populate("senderId receiverId", "name email role");
  if (!parcel) throw new Error("Parcel not found");
  return parcel;
};

