const router = require("express").Router();

const {
    getAllIdeas,
    newIdea,
    deleteIdea,
    updateIdea
} = require("../controllers/ideaController");

// GET ALL IDEAS
router.get("/getAllIdeas", getAllIdeas);

// ADD AN IDEA
router.post("/newIdea", newIdea);

// DELETE THE IDEA
router.delete("/deleteIdea/:id", deleteIdea);

// Edit THE IDEA
router.put("/updateIdea/:id", updateIdea);

module.exports = router;