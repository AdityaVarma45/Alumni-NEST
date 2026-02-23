import Opportunity from "../models/Opportunity.js";

// Create Opportunity (Alumni only)
export const createOpportunity = async (req, res) => {
  try {
    const { title, description, company } = req.body;

    const opportunity = await Opportunity.create({
      title,
      description,
      company,
      postedBy: req.user._id,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Opportunities
export const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("postedBy", "username email role")
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
