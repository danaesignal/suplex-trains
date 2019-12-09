import Dotenv from 'dotenv';
import Mongoose from 'mongoose';
import Story from '../src/story/story.model';
import fixtures from './fixtures/story.fixture';
import path from 'path';

Dotenv.config({ path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`)});

let mongoDB = process.env.DATABASE_URL;
Mongoose.connect(mongoDB);
Mongoose.Promise = global.Promise;
let db = Mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

beforeEach(function (done) {
  Story.collection.insert(fixtures, err => {
    if (err) console.log(err);
  });
  // console.log('here');
  return done();
});

afterEach(function (done) {
  for (var i in db.collections) {
       db.collections[i].remove(function() {});
  }
  return done();
});