const router = require("express").Router();

const {
    getAllIdeas,
    newIdea,
    deleteIdea,
    updateIdea,
    getIdea
} = require("../controllers/ideaController");

// GET ALL IDEAS
router.get("/getAllIdeas", getAllIdeas);

// ADD AN IDEA
router.post("/newIdea", newIdea);

// DELETE THE IDEA
router.delete("/deleteIdea/:id", deleteIdea);

// EDIT THE IDEA
router.put("/updateIdea/:id", updateIdea);

// GET THE IDEA
router.get("/getIdea/:id", getIdea);

module.exports = router;