import mongoose from "mongoose";
import { budgetModelName } from "../constants/modelNames.js";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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
    period: {
      type: String,
      required: true,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
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
budgetSchema.index({ userId: 1, categoryId: 1 });
budgetSchema.index({ userId: 1, isActive: 1 });
budgetSchema.index({ userId: 1, deleted: 1 });
budgetSchema.index({ userId: 1, startDate: 1, endDate: 1 });

export const budgetModel = mongoose.model(budgetModelName, budgetSchema);
