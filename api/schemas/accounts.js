var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountsSchema = new Schema({
  name:  String,
  type: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
});

var Account = mongoose.model('Account', accountsSchema);
