import mongoose from 'mongoose';
import { IUser } from '../config/interface';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true,
      maxLength: [20, 'Your name is up to 20 chars long.'],
    },
    account: {
      type: String,
      required: [true, 'Please add your email'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add your password'],
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/ddjri7whs/image/upload/v1638321306/fermer-ua/avatar_cugq40_nbahoq.png',
    },
    role: {
      type: String,
      default: 'user', // admin
    },
    type: {
      type: String,
      default: 'register', // login
    },
    rf_token: { type: String, select: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('user', userSchema);
