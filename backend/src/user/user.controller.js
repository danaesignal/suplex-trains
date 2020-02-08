import bcrypt from "bcrypt";
import User from "./user.model";

const UserController = {};
const saltRounds = 12;

// Test command
UserController.test = (req, res) => {
  return res.send('UserController');
};

// Retrieves a user by a specific id
UserController.findUserById = (req, res, next) => {
  User.find({
    _id: req.params.id,
  },
  function(err,results){
    if(err) next(err);
    res.send(results)
  })
};

// Retrieves all stories
UserController.getUserList = (req, res, next) => {
  User.find({
  },
  '_id, userName, displayName',
  function(err,results){
    if(err) next(err);
    res.send(results)
  })
};

UserController.createNewUser = async (req, res, next) => {
  let newUser = new User({... req.body});
  let hash = await bcrypt.hash(newUser.password, saltRounds);

  newUser.password = hash;
  newUser.save(function(err){
    if (err) return next(err);
  });
  res.send(newUser);
}

UserController.updateUser = async (req, res, next) => {
  let updatedUser = new User({... req.body});
  let originalUser = await User.find({
    _id: req.params.id,
  },
  function(err,results){
    if(err) next(err);
    return results;
  })
  originalUser = originalUser[0];
  updatedUser.isNew = false;

  let result = await bcrypt.compare(req.body.oldPassword, originalUser.password);
  console.log(result);

  if(result){
    if(req.body.newPassword){
      const hash = await bcrypt.hash(req.body.newPassword, saltRounds);
      updatedUser.password = hash;
    }
    updatedUser.save(function(err){
      if (err) return next(err);
    });
    res.send(updatedUser);
  } else {
    res.send(originalUser);
  }
}

UserController.deleteUser = async (req, res, next) => {
  User.deleteOne({ _id: req.params.id}, function(err){
    if (err) return next(err);
  });
  res.send({});
}

export default UserController;