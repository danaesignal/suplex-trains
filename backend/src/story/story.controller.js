import Story from "./story.model";

const StoryController = {};

// Test command
StoryController.test = (req, res) => {
  return res.send('StoryController');
};

// Retrieves all stories by a specific user
StoryController.findStoriesByOwner = (req, res, next) => {
  Story.find({
    owner: req.params.owner,
  },
  function(err,results){
    if(err) next(err);
    res.send(results)
  })
};

// Retrieves a story by a specific id
StoryController.findStoriesById = (req, res, next) => {
  Story.find({
    _id: req.params.id,
  },
  function(err,results){
    if(err) next(err);
    res.send(results)
  })
};

// Retrieves all stories
StoryController.getAllStories = (req, res, next) => {
  Story.find({
  },
  function(err,results){
    if(err) next(err);
    res.send(results)
  })
};

StoryController.createNewStory = (req, res, next) => {
  let newStory = new Story({... req.body});
  newStory.save(function(err){
    if (err) return next(err);
  });
  res.send(newStory);
}

StoryController.updateStoryById = async (req, res, next) => {
  let updatedStory = new Story({... req.body});
  updatedStory.isNew = false;
  updatedStory.save(function(err){
    if (err) return next(err);
  });
  res.send(updatedStory);
}

StoryController.deleteStoryById = async (req, res, next) => {
  Story.deleteOne({ _id: req.params.id}, function(err){
    if (err) return next(err);
  });
  res.send({});
}

export default StoryController;