const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register user
const registerUser = async (req, res) => {
  const {
    fullName,
    username,
    password
  } = req.body;

  // Check if user with the same username or email already exists
  const existingUser = await User.findOne({
    $or: [{ username: username }],
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "A user with the same username already exists" });
  }

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  // Add user
  const user = await User.create({
    fullName,
    username,
    password: hashedPwd
  });

  if (user) {
    res.status(201);
    res.json("User added");
  } else {
    res.status(400);
    res.json("Registration failed");
  }
};


//Login user
const login = async (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        if (await bcrypt.compareSync(req.body.password, user.password)) {
          //generate jwt token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
          });

          res.status(200).json(token);
        } else {
          res.status(401).json({
            errorMessage: "Incorrect Password!",
            status: false,
          });
        }
      } else {
        res.status(401).json({
          errorMessage: "User not registered!",
          status: false,
        });
      }
    } else {
      res.status(401).json({
        errorMessage: "Please fill out the form!",
        status: false,
      });
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
      status: false,
    });
  }
};


// get token
const getNewToken = async (req, res) => {
  try {
    const userId = req.params.id; // Access the "id" from the URL parameter
    if (userId) {
      const userFetch = await User.findById({ _id: userId });
      if (userFetch) {
        // generate token
        const token = jwt.sign({ id: userFetch._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.json(token);
      } else {
        res.status(404).json({
          errorMessage: "User not found",
        });
      }
    } else {
      res.status(400).json({
        errorMessage: "Id not found in URL parameter",
      });
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
    });
  }
};





//Get user
const getUser = async (req, res) => {
  const { 
    _id, 
    fullName, 
    username, 
    password
  } = await User.findById(
    req.user.id
  );

  res.status(200).json({
    id: _id,
    fullName, 
    username, 
    password
  });
};

//Get All users
const getAllUsers = async (req, res) => {
  const abc = await User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Delete User
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "User Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete User!",
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

//Update User details
const updateUser = async (req, res) => {
  try {
    const { 
      fullName, 
      username,
    } = req.body;

    let updateData = {
      fullName,
      username
    };

    // Updating
    const update = await User.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: 'User updated successfully',
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: 'Failed to update the User!',
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

module.exports = {
  registerUser,
  login,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getNewToken,
};
