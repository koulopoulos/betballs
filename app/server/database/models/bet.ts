import type { InferSchemaType } from 'mongoose';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import User from './user';
import Contest from './contest';

const betSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      default: () => nanoid(7),
      index: { unique: true },
    },
    amount: { type: Number, required: true },
    winner: {
      type: {
        id: { type: String, required: true },
        name: { type: String, required: true },
      },
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: () => User },
    contest: { type: mongoose.Schema.Types.ObjectId, required: true, ref: () => Contest },
  },
  { collection: 'bets' },
);

export type BetSchema = InferSchemaType<typeof betSchema>;

const model: mongoose.Model<BetSchema> = mongoose.models.Bet || mongoose.model('Bet', betSchema);

export default model;
