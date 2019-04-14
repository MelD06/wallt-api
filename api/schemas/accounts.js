var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const accountsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId, 
  name: {type: String, required: true },
  type: {type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Account', accountsSchema);
