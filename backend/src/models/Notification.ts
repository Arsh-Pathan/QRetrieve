import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  user: Types.ObjectId;
  title: string;
  body: string;
  type: 'report' | 'status_change' | 'info';
  relatedItem?: Types.ObjectId;
  relatedReport?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['report', 'status_change', 'info'], default: 'info' },
  relatedItem: { type: Schema.Types.ObjectId, ref: 'Item' },
  relatedReport: { type: Schema.Types.ObjectId, ref: 'Report' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
