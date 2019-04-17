var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const transactionsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId, 
  name: {type: String, required: true },
  value: {type: Number, required: true },
  date: { type: Date, default: Date.now },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
});

module.exports = mongoose.model('Transaction', transactionsSchema);
