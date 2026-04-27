const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyName: { type: String, required: true },
    ownerName: String,
    email: String,
    phone: String,
    gstNumber: String,
    address: String,

    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branchName: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Company", companySchema);
