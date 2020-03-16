import Express from 'express';
import Dotenv from 'dotenv';
import Mongoose from 'mongoose';
import Story from './story/story.route';
import User from './user/user.route';
import S3 from './s3/s3.route';
import JWTMiddleware from './middleware/middleware.jwt.js';
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

// Json Web Token middleware for authorization
app.use(JWTMiddleware.checkAuthorization);

// Router for API access to story
app.use('/story', Story);

// Router for API access to user
app.use('/user', User);

// Router for API access to s3 controller
app.use("/sign_s3", S3);

app.get("/", (req, res) => {
    res.send({ message: "Okay!"});
});

app.listen(port, ()=> {
  console.log(`Server running on ${port}...`);
});

export { app as server, port }