const Idea = require("../models/Idea.model");

//Get All Ideas
const getAllIdeas = async (req, res) => {
  const abc = await Idea.find()
    .then((ideas) => {
      res.json(ideas);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Add new Idea
const newIdea = async (req, res) => {
  try {
    const {
      idea,
      tags
    } = req.body;

    // Check if the same idea exists
    const ideaExists = await Idea.findOne({ idea });
    if (ideaExists) {
      res.status(401).json({
        errorMessage:
          "Idea is already exists! Please enter another one.",
        status: false,
      });
    } else {
      const ideaa = await Idea.create({
        idea,
        tags
      });
      if (ideaa) {
        res.status(200).json({
          data: "idea entered successfully",
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: "Failed to enter the idea!",
          status: false,
        });
      }
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
      status: false,
    });
  }
};

//Export
module.exports = {
    getAllIdeas,
    newIdea
};