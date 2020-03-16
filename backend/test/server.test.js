import { expect } from 'chai';
import { server, port } from '../src/server';
import request from 'supertest';
import Dotenv from 'dotenv';

Dotenv.config();

describe('Server', ()=>{
    it('tests that server is running current port', async()=>{
      expect(port).to.equal(process.env.PORT || 4500)
    })

    it('responds 200 (OK) at /', async () => {
      const response = await request(server).get('/');
      expect(response.body).to.an.instanceof(Object);
      expect(response.status).to.equal(200);
    })
});

describe('Story', ()=>{
  describe('Test Endpoint', () => {
    it('responds 200 (OK) at /story/test', async () => {
      const response = await request(server).get('/story/test');
      expect(response.body).to.an.instanceof(Object);
      expect(response.status).to.equal(200);
    })
  });
  describe('Get at /', ()=> {
    it('retrieves an array of all stories, regardless of owner', async () => {
      const response = await request(server).get('/story');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body).to.not.be.empty;
      expect(response.body).to.have.lengthOf(5);
    })
  });
  describe('Get at /id/:id', ()=> {
    it('retrieves the story with the specified id', async () => {
      let response = await request(server).get('/story');
      let storyOne = {... response.body[0]};
      response = await request(server).get(`/story/id/${storyOne._id}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body[0]).to.deep.equal(storyOne);
    })
  });
  describe('Get at /owner/:owner', () => {
    it('retrieves only stories owned by the specified account', async () => {
      let response = await request(server).get('/story/owner/1');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body).to.have.lengthOf(4);
      expect(response.body[0].owner).to.equal('1');
    })
  })
  describe('Post at /new', () => {
    it('creates a new story document when posted to /new', async () => {
      let loggedInUser = await request(server).post('/user/login').send({userName: "userone", password:"12345"});
      let newStory = {
        "displayName": "Six",
        "videoIds": ["6789", "9876"],
        "videoLabels": ["MTQ", "WTG"],
        "notes": ["NoteOne","NoteTwo"],
        "owner": "3",
        "itemLevel": "230",
        "imageName": "67890.jpg",
        "created": new Date(),
        "updated": new Date()
      };
      const response = await request(server).post('/story/new').set('Authorization', loggedInUser.body.token).send(newStory);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body.displayName).to.equal(newStory.displayName);
    })
  })
  describe('Put at /id/:id', () => {
    it('Updates an extant story object at the specified id', async () => {
      let loggedInUser = await request(server).post('/user/login').send({userName: "userone", password:"12345"});
      let originalStory = {
        "displayName": "Six",
        "videoIds": ["6789", "9876"],
        "videoLabels": ["MTQ", "WTG"],
        "notes": ["NoteOne","NoteTwo"],
        "owner": `${loggedInUser.body.user._id}`,
        "itemLevel": "230",
        "imageName": "67890.jpg",
        "created": new Date(),
        "updated": new Date()
      };
      originalStory = await request(server).post('/story/new').set('Authorization', loggedInUser.body.token).send(originalStory);
      originalStory = originalStory.body;

      originalStory = await request(server).get(`/story/id/${originalStory._id}`);
      originalStory = originalStory.body[0];

      let updatedStory = {... originalStory};
      updatedStory.displayName = "Seven";
      updatedStory = await request(server).put(`/story/id/${updatedStory._id}`).set('Authorization', loggedInUser.body.token).send(updatedStory);
      updatedStory = updatedStory.body;

      updatedStory = await request(server).get(`/story/id/${updatedStory._id}`);
      updatedStory = updatedStory.body[0];

      expect(200).to.equal(200);
      expect(Object).to.be.an.instanceof(Object);
      expect(updatedStory._id).to.equal(originalStory._id);
      expect(updatedStory.displayName).to.not.equal(originalStory.displayName);
    })
  })
  describe('Delete at /id/:id', ()=> {
    it('deletes the story with the specified id', async () => {
      let loggedInUser = await request(server).post('/user/login').send({userName: "userfive", password:"12345"});

      let response = await request(server).get('/story');
      let storyOne = {... response.body[0]};
      response = await request(server).get(`/story/id/${storyOne._id}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body[0]).to.deep.equal(storyOne);

      response = await request(server).delete(`/story/id/${storyOne._id}`).set('Authorization', loggedInUser.body.token);
      response = await request(server).get(`/story/id/${storyOne._id}`);
      expect(response.body).to.be.an('array').that.is.empty;
    })
  });
});

describe('User', ()=>{
  describe('Test Endpoint', () => {
    it('responds 200 (OK) at /user/test', async () => {
      const response = await request(server).get('/user/test');
      expect(response.body).to.an.instanceof(Object);
      expect(response.status).to.equal(200);
    })
  });
  describe('Get at /list', ()=> {
    it('retrieves an array of all users, if properly authorized', async () => {
      const response = await request(server).get('/user/list');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body).to.not.be.empty;
      expect(response.body).to.have.lengthOf(5);
    })
  });
  describe('Get at /id/:id', ()=> {
    it('retrieves the user with the specified id', async () => {
      let response = await request(server).get('/user/list');
      let userOne = {... response.body[0]};
      response = await request(server).get(`/user/id/${userOne._id}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body._id).to.deep.equal(userOne._id);
      expect(response.body.displayName).to.deep.equal(userOne.displayName);
    })
  });
  describe('Post at /new', () => {
    it('creates a new user when posted to /new', async () => {
      let newUser = {
        "userName": "userSix",
        "displayName": "User Six",
        "email": "usersix@gmail.com",
        "password": "12345",
        "authLevel": 2
      };
      const response = await request(server).post('/user/new').send(newUser);
      expect(response.status).to.equal(200);
      expect(response.body.user).to.be.an.instanceof(Object);
      expect(response.body.user.displayName).to.equal(newUser.displayName);
    })
  })
  describe('Put at /id/:id', () => {
    it('Updates an extant user object at the specified id where supplied password is correct', async () => {
      let originalUser = {
        "userName": "userSix",
        "displayName": "User Six",
        "email": "usersix@gmail.com",
        "password": "12345",
        "authLevel": 3
      };
      originalUser = await request(server).post('/user/new').send(originalUser);
      let token = originalUser.body.token;
      originalUser = originalUser.body.user;

      let updatedUser = {
        displayName: "User Sixteen",
        password: "12345"
      };
      updatedUser = await request(server).put(`/user/id/${originalUser._id}`).set('Authorization', token).send(updatedUser);
      updatedUser = await request(server).get(`/user/id/${originalUser._id}`);

      expect(updatedUser.status).to.equal(200);
      expect(updatedUser.body).to.be.an.instanceof(Object);
      expect(updatedUser.body._id).to.equal(originalUser._id);
      expect(updatedUser.body.displayName).to.not.equal(originalUser.displayName);
    })
    it('Rejects updates at the specified ID where provided password is incorrect', async () => {
      let originalUser = {
        "userName": "userSix",
        "displayName": "User Six",
        "email": "usersix@gmail.com",
        "password": "12345",
        "authLevel": 2
      };
      originalUser = await request(server).post('/user/new').send(originalUser);
      originalUser = originalUser.body.user;

      originalUser = await request(server).get(`/user/id/${originalUser._id}`);
      originalUser = originalUser.body;

      let updatedUser = {... originalUser};
      updatedUser.displayName = "User Sixteen";
      updatedUser.newPassword = "54321";
      updatedUser.oldPassword = "12346";

      await request(server).put(`/user/id/${originalUser._id}`).send(updatedUser);
      updatedUser = await request(server).get(`/user/id/${originalUser._id}`);

      expect(updatedUser.status).to.equal(200);
      expect(updatedUser.body).to.be.an.instanceof(Object);
      expect(updatedUser.body._id).to.equal(originalUser._id);
      expect(updatedUser.body.displayName).to.equal(originalUser.displayName);
    })
  })
  describe('Delete at /id/:id', ()=> {
    it('deletes the user with the specified id', async () => {
      let loggedInUser = await request(server).post('/user/login').send({userName: "userone", password:"12345"});

      let response = await request(server).get('/user/list');
      let userOne = {... response.body[0]};
      response = await request(server).get(`/user/id/${userOne._id}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body._id).to.deep.equal(userOne._id);

      response = await request(server).delete(`/user/id/${userOne._id}`).set('Authorization', loggedInUser.body.token);
      response = await request(server).get(`/user/id/${userOne._id}`);
      expect(response.body).to.be.an('object').that.is.empty;
    })
  });
});