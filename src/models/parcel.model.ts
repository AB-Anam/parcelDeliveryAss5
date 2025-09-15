import mongoose, { Schema, Document, Types } from "mongoose";


export type ParcelStatus =
  | "Requested"
  | "Approved"
  | "Dispatched"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface IStatusLog {
  status: ParcelStatus;
  note?: string;
  location?: string;
  updatedBy?: Types.ObjectId;
  createdAt?: Date;
}

export interface IParcel extends Document {
  trackingId: string;
  type: string;
  weight: number;
  fee: number;
  sender: Types.ObjectId;
  receiver: { name: string; phone: string; address: string; email?: string };
  status: ParcelStatus;
  statusLogs: IStatusLog[];
  blocked?: boolean;
}

const StatusLogSchema = new Schema<IStatusLog>(
  {
    status: { type: String, required: true },
    note: String,
    location: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ParcelSchema = new Schema<IParcel>(
  {
    trackingId: { type: String, unique: true },
    type: { type: String, default: "standard" },
    weight: { type: Number, required: true },
    fee: { type: Number, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: {
      name: String,
      phone: String,
      address: String,
      email: String,
    },
    status: { type: String, default: "Requested" },
    statusLogs: { type: [StatusLogSchema], default: [] },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IParcel>("Parcel", ParcelSchema);
