const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");

const router = express.Router();
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

//
// User schema and model
//

// This is the schema. Users have usernames and passwords. We solemnly promise to
// salt and hash the password!
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  favorite: String,
  description: String,
  location: String,
  username: String,
  password: String,
});

// This is a hook that will be called before a user record is saved,
// allowing us to be sure to salt and hash the password first.
userSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password'))
    return next();

  try {
    // generate a hash. argon2 does the salting and hashing for us
    const hash = await argon2.hash(this.password);
    // override the plaintext password with the hashed one
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// This is a method that we can call on User objects to compare the hash of the
// password the browser sends with the has of the user's true password stored in
// the database.
userSchema.methods.comparePassword = async function (password) {
  try {
    // note that we supply the hash stored in the database (first argument) and
    // the plaintext password. argon2 will do the hashing and salting and
    // comparison for us.
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

// This is a method that will be called automatically any time we convert a user
// object to JSON. It deletes the password hash from the object. This ensures
// that we never send password hashes over our API, to avoid giving away
// anything to an attacker.
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

// create a User model from the User schema
const User = mongoose.model('User', userSchema);

/* Middleware */

// middleware function to check for logged-in users
const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }
    // set the user field in the request
    req.user = user;
  } catch (error) {
    // Return an error if user does not exist.
    return res.status(403).send({
      message: "not logged in"
    });
  }

  // if everything succeeds, move to the next middleware
  next();
};

/* API Endpoints */

/* All of these endpoints start with "/" here, but will be configured by the
   module that imports this one to use a complete path, such as "/api/user" */

// create a new user
router.post('/', async (req, res) => {
  // Make sure that the form coming from the browser includes all required fields,
  // otherwise return an error. A 400 error means the request was
  // malformed.
  if (!req.body.firstName || !req.body.lastName || !req.body.description || !req.body.favorite || !req.body.username || !req.body.password)
    return res.status(400).send({
      message: "first name, last name, description, favorite car, username and password are required"
    });

  try {

    //  Check to see if username already exists and if not send a 403 error. A 403
    // error means permission denied.
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (existingUser)
      return res.status(403).send({
        message: "username already exists"
      });

    // create a new user and save it to the database
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      description: req.body.description,
      location: req.body.location,
      favorite: req.body.favorite,
      username: req.body.username,
      password: req.body.password
    });
    await user.save();
    // set user session info
    req.session.userID = user._id;

    // send back a 200 OK response, along with the user that was created
    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// login a user
router.post('/login', async (req, res) => {
  // Make sure that the form coming from the browser includes a username and a
  // password, otherwise return an error.
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    //  lookup user record
    const user = await User.findOne({
      username: req.body.username
    });
    // Return an error if user does not exist.
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    // Return the SAME error if the password is wrong. This ensure we don't
    // leak any information about which users exist.
    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    // set user session info
    req.session.userID = user._id;

    return res.send({
      user: user
    });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get logged in user
router.get('/', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// logout
router.delete("/", validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Edit Users info

router.put('/:userID', validUser, async (req, res) => {
  try {
    let per = await User.findOne({ _id: req.params.userID })
    if (!per) {
      res.sendStatus(404);
      return;
    }
    per.firstName = req.body.firstName;
    per.lastName = req.body.lastName;
    per.description = req.body.description;
    per.location = req.body.location;
    per.favorite = req.body.favorite;

    await per.save();

    res.send(per);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// Get username from ID

router.get('/:userID', async(req, res) => {
  try { 
    let user = await User.findOne({_id: req.params.userID});
    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.send(user);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});


//Schema for Car

const carSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  make: String,
  model: String,
  color: String,
  year: String,
  path: String,
});

//Model for Car

const Car = mongoose.model('Car', carSchema);

//Upload Car Photo

router.post('/carphotos', upload.single('carphoto'), async (req, res) => {
  //Safety Check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

//Create Car

router.post('/:userID/cars', validUser, async (req, res) => {
  try {
    let per = await User.findOne({ _id: req.params.userID })
    if (!per) {
      res.sendStatus(404);
      return;
    }
    let car = new Car({
      user: per,
      make: req.body.make,
      model: req.body.model,
      color: req.body.color,
      year: req.body.year,
      path: req.body.path,
    });
    await car.save();
    res.send(car);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Send all cars

router.get('/:userID/cars/:carID', async (req, res) => {
  try {
    let car = await Car.findOne({ _id: req.params.carID, user: req.params.userID });
    if (!car) {
      res.sendStatus(404);
      return;
    }
    let cars = await Car.find({ user: user });
    res.send(cars);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Send users cars to personal page

router.get('/:userID/cars', async (req, res) => {
  try {
    let car = await Car.find({user: req.params.userID });
    if (!car) {
      res.sendStatus(404);
      return;
    }
    res.send(car);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//get all cars for car page

router.get("/cars/all", async(req, res) => {
  try {
    let cars  = await Car.find().sort({
      created: -1
    }).populate('user');
    return res.send(cars);
  } catch(error) {
    console.log(error);
    return res.sendStatus(500);
  }
}),

//get a single car for car page

router.get('/cars/:carID', async (req, res) =>{
  try {
    let car = await Car.findOne({_id:req.params.carID});
    if (!car) {
      res.sendStatus(404);
      return;
    }
    res.send(car);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Edit vehicle info

router.put('/:userID/cars/:carID', validUser, async(req,res) => {
  try{
    let car = await Car.findOne({_id: req.params.carID, user: req.params.userID});
    if(!car) {
      res.sendStatus(404);
      return;
    }
    car.make = req.body.make;
    car.model = req.body.model;
    car.color = req.body.color;
    car.year = req.body.year;

    await car.save();

    res.send(car);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});


//Delete Vehicle

router.delete('/:userID/cars/:carID', validUser, async (req, res) => {
  try {
    let car = await Car.findOne({_id:req.params.carID, user: req.params.userID});
    if (!car) {
      res.sendStatus(404);
      return;
    }
    await car.delete();
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});



//Schema for Comments
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  car: {
    type: mongoose.Schema.ObjectId,
    ref: "Car"
  },
  text: String,
  created: {
    type: Date,
    default: Date.now
  },
});

//Model for Comments
const Comment = mongoose.model('Comment', commentSchema);


//Add a comment to car page

router.post("/cars/:id", validUser, async (req, res) => {
  try {
    let car = await Car.findOne({_id: req.params.id
    }).sort({
      created: -1
    }).populate('user');
    let comment = new Comment({
      text: req.body.text,
      user: req.user,
      car: car,
    });
    await comment.save();
    return res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});


//get Comments for specific car
router.get("/cars/:id/comments", async (req, res) => {
  try {
    let car = await Car.findOne({
      _id: req.params.id
    }).sort({
      created: -1
    }).populate('user');
    let comments = await Comment.find({
      car: car,
    }).sort({
      created: -1
    }).populate('user');
    return res.send(comments);
  } catch(error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


module.exports = {
  routes: router,
  model: User,
  valid: validUser
};