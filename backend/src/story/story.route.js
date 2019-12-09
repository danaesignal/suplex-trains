import express from 'express';
import storyController from './story.controller';
let router = express.Router();

router.get('/test', storyController.test);
router.get('/owner/:owner', storyController.findStoriesByOwner);
router.get('/id/:id', storyController.findStoriesById);
router.put('/id/:id', storyController.updateStoryById);
router.delete('/id/:id', storyController.deleteStoryById);
router.get('/', storyController.getAllStories);
router.post('/new', storyController.createNewStory);

export default router;