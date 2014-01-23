'use strict';

module.exports = {
  env: 'production',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://audb:ad34epam@paulo.mongohq.com:10003/app21468269'
  }
};