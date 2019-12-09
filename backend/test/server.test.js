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
      const response = await request(server).post('/story/new').send(newStory);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body.displayName).to.equal(newStory.displayName);
    })
  })
  describe('Put at /id/:id', () => {
    it('Updates an extant story object at the specified id', async () => {
      let originalStory = {
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
      originalStory = await request(server).post('/story/new').send(originalStory);
      originalStory = originalStory.body;

      originalStory = await request(server).get(`/story/id/${originalStory._id}`);
      originalStory = originalStory.body[0];

      let updatedStory = {... originalStory};
      updatedStory.displayName = "Seven";
      updatedStory = await request(server).put(`/story/id/${updatedStory._id}`).send(updatedStory);
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
      let response = await request(server).get('/story');
      let storyOne = {... response.body[0]};
      response = await request(server).get(`/story/id/${storyOne._id}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an.instanceof(Object);
      expect(response.body[0]).to.deep.equal(storyOne);

      response = await request(server).delete(`/story/id/${storyOne._id}`);
      response = await request(server).get(`/story/id/${storyOne._id}`);
      expect(response.body).to.be.an('array').that.is.empty;
    })
  });
});
