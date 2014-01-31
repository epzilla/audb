'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * Thing Schema
 */
var GameSchema = new Schema({
  _id: ObjectId,
  Game: Number,
  Result: String,
  Opponent: String,
  auscore: Number,
  opscore: Number,
  Date: String,
  Location: String,
  Season: Number,
  SEC: String,
  Conference: String,
  currentConf: String,
  BCS: String,
  FBS: String,
  gameid: Number
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Game', GameSchema);
