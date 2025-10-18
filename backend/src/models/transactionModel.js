import mongoose from "mongoose";
import { transactionModelName } from "../constants/modelNames.js";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["expense", "income", "transfer", "adjustment"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    // For tracking payment method or account
    paymentMethod: {
      type: String,
      trim: true,
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
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, amount: 1 });
transactionSchema.index({ userId: 1, deleted: 1 });

export const transactionModel = mongoose.model(transactionModelName, transactionSchema);
