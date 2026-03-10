import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IItem extends Document {
  itemId: string;
  owner: Types.ObjectId;
  itemName: string;
  description?: string;
  photoUrl?: string;
  status: 'safe' | 'lost' | 'found';
  qrDataUrl?: string;
  createdAt: Date;
}

const itemSchema = new Schema<IItem>({
  itemId: { type: String, required: true, unique: true, index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  photoUrl: { type: String },
  status: { type: String, enum: ['safe', 'lost', 'found'], default: 'safe' },
  qrDataUrl: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const Item = mongoose.model<IItem>('Item', itemSchema);
