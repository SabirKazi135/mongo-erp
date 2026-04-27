const Company = require("../models/Company");

const addCompany = async (req, res) => {
  try {
    const company = await Company.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true },
    );

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addCompany,
  getCompanies,
  updateCompany,
};
