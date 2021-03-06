'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Thing Schema
 */
var ConferenceSchema = new Schema({
  Conference: String,
  Members: [],
  BCS: Boolean,
  FBS: Boolean,
  FCS: Boolean,
  Defunct: Boolean
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Conference', ConferenceSchema);
