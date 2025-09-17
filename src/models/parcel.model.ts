import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStatusLog {
  status: string;
  timestamp: Date;
  updatedBy?: Types.ObjectId;
  note?: string;
}

export interface IParcel extends Document {
  type: string;
  weight: number;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  pickupAddress: string;
  deliveryAddress: string;
  fee: number;
  status: string;
  trackingId: string;          // ✅ Added trackingId
  trackingEvents: IStatusLog[];
}

const StatusLogSchema = new Schema<IStatusLog>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    note: { type: String },
  },
  { _id: false } // prevents auto _id for each log entry
);

const ParcelSchema = new Schema<IParcel>(
  {
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    fee: { type: Number, required: true },
    status: { type: String, default: "Requested" },
    trackingId: { type: String, unique: true, required: true }, // ✅ unique trackingId
    trackingEvents: [StatusLogSchema],
  },
  { timestamps: true } // adds createdAt / updatedAt
);

export default mongoose.model<IParcel>("Parcel", ParcelSchema);
