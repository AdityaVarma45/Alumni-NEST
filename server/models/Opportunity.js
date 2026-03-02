import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    /* opportunity type */
    type: {
      type: String,
      enum: [
        "internship",
        "job",
        "referral",
        "guidance",
        "hackathon",
        "freelance",
      ],
      required: true,
    },

    location: {
      type: String,
      default: "Remote",
    },

    applyLink: {
      type: String,
      default: "",
    },

    skills: [String],

    compensation: {
      type: String,
      default: "",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* active / closed */
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    /* analytics */
    views: {
      type: Number,
      default: 0,
    },

    /* saved by students */
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Opportunity = mongoose.model(
  "Opportunity",
  opportunitySchema
);

export default Opportunity;