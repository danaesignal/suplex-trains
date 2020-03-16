import bcrypt from "bcrypt";
import User from "./user.model";
import Utils from "../utils/utils";
import JWT from 'jsonwebtoken';

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
    res.send(Utils.cleanUser(results[0]));
  })
};

// Logs a user in
UserController.logIn = (req, res, next) => {
  User.findOne(
    {
    userName: req.body.userName
    },
    (err, result) => {
      if(err) next(err);
      if(!result){
        return res.status(404).json({
          error: true,
          message: "User not found"
        });
      }
      bcrypt.compare(req.body.password, result.password, (err, valid) => {
        if(!valid){
          return res.status(404).json({
            error: true,
            message: "Password incorrect"
          });
        }

        const token = Utils.generateToken(result);

        res.send(
          {
            user: Utils.cleanUser(result),
            token: token
          }
        );
      })
    }
  )
};

// Reauthenticate from JSON Web Token
UserController.reauthenticate = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
   return res.status(401).json({message: "Missing token"});
  }

  // Ensure token is valid
  JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) next(err);

    // Provide user for front-end to use
    User.findById(
      {
        _id: user._id
      },
      (err, user) => {
        if (err) next(err);
        res.send(
          {
            user: Utils.cleanUser(user),
            token: token
          }
        );
     });
  });
};

// Retrieves an abbreviated list of all users
UserController.getUserList = (req, res, next) => {
  User.find({
  },
  '_id, userName, displayName',
  function(err,results){
    if(err) next(err);
    res.send(results)
  })
};

// Create a new user via app signup
UserController.createNewUser = async (req, res, next) => {
  let newUser = new User({... req.body});
  let hash = await bcrypt.hash(newUser.password, saltRounds);

  newUser.password = hash;
  newUser.created = newUser.created ? null : Date.now();
  newUser.updated = newUser.updated ? null : Date.now();

  newUser.save(function(err){
    if (err){
      if(err.code===11000){
        return res.send({
          error: true,
          message: "Username taken; please choose another",
          user: Utils.cleanUser(newUser)
        });
      } else {
        next(err);
      }
    }
    const token = Utils.generateToken(newUser);
    res.send(
      {
        user: Utils.cleanUser(newUser),
        token: token
      }
    );
  });
}

UserController.updateUser = async (req, res, next) => {
  // This action requires a user to be logged in.
  if(!req.userFromToken){
    return res.status(401).json({message: "Unauthorized"});
  }
  // Users can only edit themselves. Admins can edit anyone.
  if(req.userFromToken._id === req.params.id || req.userFromToken.authLevel === 3){
    let updatedInfo = req.body;
    let previousUser = await User.findOne({
        _id: req.params.id
      },
      function(err){
        if (err) return next(err);
      }
    );
    if(!previousUser){
      return res.status(401).json({
        error: true,
        message: "User not found"
      });
    }
    let pwCompareResult = await bcrypt.compare(updatedInfo.password, previousUser.password);
    if (!pwCompareResult){
      return res.status(401).json({
        error: true,
        message: "Password incorrect"
      });
    } else {
      updatedInfo.password = previousUser.password;
      if(updatedInfo.newPassword){
        const hash = await bcrypt.hash(updatedInfo.newPassword, saltRounds);
        updatedInfo.password = hash;
      }
      let result = await User.findOneAndUpdate(
        {_id: req.params.id},
        updatedInfo,
        {new: true}
      );
      res.send(Utils.cleanUser(result));
    }
  } else {
    return res.status(401).json({message: "Unauthorized"});
  }
}

UserController.deleteUser = async (req, res, next) => {
  // This action requires a user to be logged in.
  if(!req.userFromToken){
    return res.status(401).json({message: "Unauthorized"});
  }

  // Users can only delete themselves. Admins can delete anyone.
  if(req.userFromToken._id === req.params.id || req.userFromToken.authLevel === 3){
    User.deleteOne({ _id: req.params.id}, function(err){
      if (err) return next(err);
    });
    res.send({message: "User deleted"});
  } else {
    return res.status(401).json({message: "Unauthorized"});
  }
}

export default UserController;