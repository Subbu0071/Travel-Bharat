import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    state: { type: String, required: true, trim: true, index: true },
    stateSlug: { type: String, required: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    citySlug: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ["Heritage", "Nature", "Adventure", "Religious"],
      required: true,
      index: true
    },
    description: { type: String, required: true },
    bestTime: { type: String, required: true },
    fees: { type: String, required: true },
    map: { type: String, required: true },
    images: [{ type: String, required: true }],
    nearby: [{ type: String }],
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

destinationSchema.index({
  name: "text",
  state: "text",
  city: "text",
  category: "text",
  description: "text"
});

export const Destination = mongoose.model("Destination", destinationSchema);
