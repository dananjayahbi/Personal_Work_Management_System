const router = require("express").Router();

const {
    getAllIdeas,
    newIdea,
    deleteIdea
} = require("../controllers/ideaController");

// GET ALL IDEAS
router.get("/getAllIdeas", getAllIdeas);

// ADD AN IDEA
router.post("/newIdea", newIdea);

// DELETE THE IDEA
router.delete("/deleteIdea/:id", deleteIdea);

module.exports = router;