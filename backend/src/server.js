import Express from 'express';
import Dotenv from 'dotenv';
import Mongoose from 'mongoose';
import Story from './story/story.route.js';
import path from 'path';

Dotenv.config({ path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`)});

const port = process.env.PORT || 4500;
const app = Express();

let mongoDB = process.env.DATABASE_URL;
Mongoose.connect(mongoDB);
Mongoose.Promise = global.Promise;
let db = Mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(Express.json());
app.use(Express.urlencoded({extended: false}));

// Router for API access to story objects
app.use('/story', Story);

app.get("/", (req, res) => {
    res.send({ message: "Okay!"});
});

app.listen(port, ()=> {
  console.log(`Server running on ${port}...`);
});

export { app as server, port }