import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* =====================================================
   USER MODEL
   Core identity + profile data for AlumniNest
===================================================== */

const userSchema = new mongoose.Schema(
  {
    /* ---------- BASIC INFO ---------- */
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ---------- ROLE SYSTEM ---------- */
    // controlled role selection (enum = clean data)
    role: {
      type: String,
      enum: ["student", "alumni", "admin"],
      default: "student",
    },

    /* =====================================================
       👑 MASTER SKILL SYSTEM (NEW)
       Users CANNOT type random skills.
       They only select from server master list.
    ===================================================== */

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ---------- PRESENCE ENGINE ---------- */
    lastSeen: {
      type: Date,
      default: null,
    },

    /* ---------- SOCIAL SAFETY ---------- */
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

/* =====================================================
   PASSWORD HASHING
   Runs automatically before save
===================================================== */
userSchema.pre("save", async function (next) {
  // prevent rehash on updates
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/* =====================================================
   MODEL EXPORT
===================================================== */
const User = mongoose.model("User", userSchema);

export default User;