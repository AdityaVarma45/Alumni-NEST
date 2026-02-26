import mongoose from "mongoose";

const mentorshipSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// prevent duplicate requests
mentorshipSchema.index(
  { student: 1, alumni: 1 },
  { unique: true }
);

const Mentorship = mongoose.model(
  "Mentorship",
  mentorshipSchema
);

export default Mentorship;