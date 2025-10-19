import mongoose from "mongoose";
import { regularPaymentModelName, accountModelName, categoryModelName } from "../constants/modelNames.js";

const regularPaymentSchema = new mongoose.Schema(
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
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    frequency: {
      type: String,
      required: true,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: categoryModelName,
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: accountModelName,
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
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
regularPaymentSchema.index({ userId: 1, isActive: 1 });
regularPaymentSchema.index({ userId: 1, nextDueDate: 1 });
regularPaymentSchema.index({ userId: 1, categoryId: 1 });
regularPaymentSchema.index({ userId: 1, accountId: 1 });
regularPaymentSchema.index({ userId: 1, deleted: 1 });
regularPaymentSchema.index({ userId: 1, frequency: 1 });

export const regularPaymentModel = mongoose.model(regularPaymentModelName, regularPaymentSchema);
