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

export const confirmDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new Error("Parcel not found");

  // ✅ Check that logged-in user is the assigned receiver
  if (parcel.receiverId.toString() !== receiverId) {
    throw new Error("You are not authorized to confirm this delivery");
  }

  if (parcel.status === "Delivered") {
    throw new Error("Parcel already confirmed as delivered");
  }

parcel.trackingEvents.push({
  status: "Delivered",
  updatedBy: new Types.ObjectId(receiverId),
  note: "Receiver confirmed delivery",
  timestamp: new Date(),   // ✅ match schema
});

  await parcel.save();
  return parcel;
};

