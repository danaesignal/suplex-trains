import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {type: String, required: true},
  displayName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  authLevel: {type: Number, required: true},
  created: {type: Date, required: true},
  updated: {type: Date, required: true}
});

export default mongoose.model('User', userSchema);