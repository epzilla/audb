'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Thing Schema
 */
var RecruitSchema = new Schema({
  forename: String,
  surname: String,
  pos: String,
  trupos: String,
  class: Number,
  city: String,
  state: String,
  hs: String,
  rivalsstars: Number,
  scoutstars: Number,
  avgstars: Number,
  avgrank: Number,
  rivalsrank: Number,
  scoutrank: Number,
  lat: Number,
  long: Number,
  earlyEnrollee: Boolean
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Recruit', RecruitSchema);
