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
      tags,
      ideaStatus,
      bookmark
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
        tags,
        ideaStatus,
        bookmark
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

//Get an Idea
const getIdea = async (req, res) => {
  const { 
    _id, 
    idea, 
    tags
  } = await Idea.findById(
    req.params.id
  );

  res.status(200).json({
    id: _id,
    idea, 
    tags
  });
};


//Update Idea
const updateIdea = async (req, res) => {
  try {
    const { 
      idea, 
      tags,
      ideaStatus,
      bookmark
    } = req.body;

    let updateData = {
      idea,
      tags,
      ideaStatus,
      bookmark
    };

    // Updating
    const update = await Idea.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: 'Idea updated successfully',
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: 'Failed to edit the Idea!',
        status: false,
      });
    }
    
  } catch (error) {
    res.status(401).json({
      errorMessage: 'Something went wrong!\n' + error,
      status: false,
    });
  }
};

//Delete Idea
const deleteIdea = async (req, res) => {
  try {
    const deleted = await Idea.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "Idea Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete the Idea!",
        status: false,
      });
    }
  } catch (error) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + error,
      status: false,
    });
  }
};

//Export
module.exports = {
    getAllIdeas,
    newIdea,
    deleteIdea,
    updateIdea,
    getIdea
};