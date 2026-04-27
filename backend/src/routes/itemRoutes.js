const router = require("express").Router();

const protect = require("../middlewares/authMiddleware");

const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

router.post("/", protect, addItem);
router.get("/", protect, getItems);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;
