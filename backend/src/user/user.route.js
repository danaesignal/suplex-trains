import express from 'express';
import userController from './user.controller';
let router = express.Router();

router.get('/test', userController.test);
router.get('/id/:id', userController.findUserById);
router.put('/id/:id', userController.updateUser);
router.delete('/id/:id', userController.deleteUser);
router.get('/list', userController.getUserList);
router.post('/new', userController.createNewUser);
router.post('/login', userController.logIn);
router.get('/reauth', userController.reauthenticate);

export default router;