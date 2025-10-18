import mongoose from "mongoose";
import { categoryModelName } from "../constants/modelNames.js";

const categorySchema = new mongoose.Schema(
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
    color: {
      type: String,
      trim: true,
      maxlength: 7, // For hex color codes like #FF5733
      default: "#3B82F6", // Default blue color
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "category", // Default icon
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
categorySchema.index({ userId: 1, name: 1 });
categorySchema.index({ userId: 1, isActive: 1 });
categorySchema.index({ userId: 1, deleted: 1 });

export const categoryModel = mongoose.model(categoryModelName, categorySchema);
