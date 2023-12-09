import type { InferSchemaType } from 'mongoose';
import mongoose from 'mongoose';
import Bet from './bet';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      required: true,
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    bets: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Bet }], required: true },
  },
  { collection: 'users' },
);

export type UserSchema = InferSchemaType<typeof userSchema>;

const model: mongoose.Model<UserSchema> =
  mongoose.models.User || mongoose.model('User', userSchema);

export default model;
