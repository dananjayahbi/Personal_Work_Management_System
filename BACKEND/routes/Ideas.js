const router = require("express").Router();

const {
    getAllIdeas,
    newIdea
} = require("../controllers/ideaController");

// GET ALL IDEAS
router.get("/getAllIdeas", getAllIdeas);

// ADD AN IDEA
router.post("/newIdea", newIdea);

module.exports = router;