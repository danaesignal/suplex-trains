import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let storySchema = new Schema({
  displayName: {type: String, required: true},
  videoIds: {type: Array, required: true},
  videoLabels: {type: Array, required: true},
  notes: {type: Array, required: true},
  owner: {type: String, required: true},
  itemLevel: {type: Number, required: false},
  imageName: {type: String, required: true},
  created: {type: Date, required: true},
  updated: {type: Date, required: true}
});

export default mongoose.model('Story', storySchema);