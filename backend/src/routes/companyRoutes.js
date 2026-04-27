const router = require("express").Router();

const protect = require("../middlewares/authMiddleware");

const {
  addCompany,
  getCompanies,
  updateCompany,
} = require("../controllers/companyController");

router.post("/", protect, addCompany);
router.get("/", protect, getCompanies);
router.put("/:id", protect, updateCompany);

module.exports = router;
