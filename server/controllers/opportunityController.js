import Opportunity from "../models/Opportunity.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

/* ===============================
   CREATE OPPORTUNITY
=============================== */
export const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      type,
      location,
      applyLink,
      skills,
      compensation,
    } = req.body;

    if (!title || !description || !company || !type) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const opportunity = await Opportunity.create({
      title,
      description,
      company,
      type,
      location,
      applyLink,
      skills,
      compensation,
      postedBy: req.user._id,
    });

    // 🔔 Notify all students
    const students = await User.find({ role: "student" });

    for (const student of students) {
      await createNotification({
        recipient: student._id,
        sender: req.user._id,
        type: "new_opportunity",
        message: `New opportunity posted: ${title}`,
        relatedId: opportunity._id,
      });
    }

    res.status(201).json(opportunity);
  } catch (error) {
    console.error("Create Opportunity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET ALL OPPORTUNITIES
=============================== */
export const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      status: "active",
    })
      .populate("postedBy", "username role")
      .sort({ createdAt: -1 });

    const userId = req.user._id.toString();

    const feed = opportunities.map((op) => {
      const obj = op.toObject();

      obj.isSaved = op.savedBy?.some((id) => id.toString() === userId) || false;

      obj.savedByCount = op.savedBy?.length || 0;

      return obj;
    });

    res.json(feed);
  } catch (error) {
    console.error("Get Opportunities Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET SINGLE OPPORTUNITY
=============================== */
export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "postedBy",
      "username role",
    );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    opportunity.views += 1;
    await opportunity.save();

    res.json(opportunity);
  } catch (error) {
    console.error("Get Opportunity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   DELETE OPPORTUNITY
=============================== */
export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    if (
      opportunity.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await opportunity.deleteOne();

    res.json({ message: "Opportunity deleted" });
  } catch (error) {
    console.error("Delete Opportunity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   TOGGLE STATUS
=============================== */
export const toggleOpportunityStatus = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    if (
      opportunity.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    opportunity.status = opportunity.status === "active" ? "closed" : "active";

    await opportunity.save();

    res.json(opportunity);
  } catch (error) {
    console.error("Toggle Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   SAVE / UNSAVE
=============================== */
export const toggleSaveOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadySaved = opportunity.savedBy.some(
      (id) => id.toString() === userId,
    );

    if (alreadySaved) {
      opportunity.savedBy = opportunity.savedBy.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      opportunity.savedBy.push(userId);
    }

    await opportunity.save();

    res.json({
      saved: !alreadySaved,
      savedCount: opportunity.savedBy.length,
    });
  } catch (error) {
    console.error("Save Opportunity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
