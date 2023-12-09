import type { InferSchemaType } from 'mongoose';
import mongoose from 'mongoose';
import Bet from './bet';

const contestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    bets: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Bet }], required: true },
  },
  { collection: 'contests' },
);

export type ContestSchema = InferSchemaType<typeof contestSchema>;

const model: mongoose.Model<ContestSchema> =
  mongoose.models.Contest || mongoose.model('Contest', contestSchema);

export default model;
