import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimal extends Document {
  name: string;
  species: string;
  breed: string;
  birthDate: Date;
  farmId: mongoose.Types.ObjectId;
  status: 'healthy' | 'sick' | 'quarantine';
  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema = new Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  birthDate: { type: Date, required: true },
  farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  status: { 
    type: String, 
    enum: ['healthy', 'sick', 'quarantine'],
    default: 'healthy'
  }
}, {
  timestamps: true
});

export default mongoose.model<IAnimal>('Animal', AnimalSchema);
