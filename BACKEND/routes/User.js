const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
  registerUser,
  getUser,
  login,
  getAllUsers,
  deleteUser,
  updateUser,
  getNewToken,
} = require("../controllers/userController");

//REGISTER
router.post("/register", registerUser);

// GET USER
router.get("/get",protect, getUser);

// GET ALL USERS
router.get("/getAllUsers", getAllUsers);

// UPDATE USER DETAILS
router.put("/updateUser/:id", updateUser);

// DELETE USER
router.delete("/deleteUser/:id", deleteUser);

//LOGIN
router.post("/login", login);

//GET NEW TOKEN
router.post("/token/:id", getNewToken);

module.exports = router;
