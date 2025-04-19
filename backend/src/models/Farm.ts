import mongoose, { Document, Schema } from 'mongoose';

export interface IFarm extends Document {
  name: string;
  location: string;
  size: number;
  productionType: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FarmSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  size: { type: Number, required: true }, // in hectares
  productionType: [{ type: String }], // e.g., ['dairy', 'crops', 'livestock']
}, {
  timestamps: true
});

export default mongoose.model<IFarm>('Farm', FarmSchema);
