'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * Thing Schema
 */
var RecruitSchema = new Schema({
  _id: ObjectId,
  forename: String,
  surname: String,
  pos: String,
  trupos: String,
  class: Number,
  city: String,
  state: String,
  hs: String,
  rivalsStars: Number,
  scoutStars: Number,
  avgStars: Number,
  avgRank: Number,
  rivalsRank: Number,
  scoutRank: Number,
  latitude: Number,
  longitude: Number,
  earlyEnrollee: Boolean
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Recruit', RecruitSchema);
