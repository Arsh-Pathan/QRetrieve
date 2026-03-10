import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReport extends Document {
  reportId: string;
  itemId: string;
  item: Types.ObjectId;
  finderName: string;
  finderContact?: string;
  finderLocation: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  message?: string;
  createdAt: Date;
}

const reportSchema = new Schema<IReport>({
  reportId: { type: String, required: true, unique: true },
  itemId: { type: String, required: true, index: true },
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  finderName: { type: String, required: true, trim: true },
  finderContact: { type: String, default: '', trim: true },
  finderLocation: { type: String, required: true, trim: true },
  latitude: { type: Number },
  longitude: { type: Number },
  photoUrl: { type: String },
  message: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const Report = mongoose.model<IReport>('Report', reportSchema);
