'use strict';

describe('Service: Touchdetect', function () {

  // load the service's module
  beforeEach(module('audbApp'));

  // instantiate service
  var Touchdetect;
  beforeEach(inject(function (_Touchdetect_) {
    Touchdetect = _Touchdetect_;
  }));

  it('should do something', function () {
    expect(!!Touchdetect).toBe(true);
  });

});
