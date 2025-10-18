import mongoose from "mongoose";
import { accountModelName } from "../constants/modelNames.js";
import accountTypes from "../constants/accountTypes.js";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 256,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(accountTypes),
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    accountNumber: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Soft delete fields
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/** indexes */
accountSchema.index({ userId: 1, name: 1 });
accountSchema.index({ userId: 1, type: 1 });
accountSchema.index({ userId: 1, isActive: 1 });
accountSchema.index({ userId: 1, deleted: 1 });
accountSchema.index({ userId: 1, balance: 1 });

export const accountModel = mongoose.model(accountModelName, accountSchema);
