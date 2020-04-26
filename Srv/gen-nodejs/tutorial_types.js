//
// Autogenerated by Thrift Compiler (0.14.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
"use strict";

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;
var Int64 = require('node-int64');


var ttypes = module.exports = {};
ttypes.TemperatureScale = {
  'CELSIUS' : 1,
  'KELVIN' : 2,
  'FAHRENHEIT' : 3
};
var State = module.exports.State = function(args) {
  this.alive = null;
  this.processing = null;
  if (args) {
    if (args.alive !== undefined && args.alive !== null) {
      this.alive = args.alive;
    }
    if (args.processing !== undefined && args.processing !== null) {
      this.processing = args.processing;
    }
  }
};
State.prototype = {};
State.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.BOOL) {
        this.alive = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.BOOL) {
        this.processing = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

State.prototype.write = function(output) {
  output.writeStructBegin('State');
  if (this.alive !== null && this.alive !== undefined) {
    output.writeFieldBegin('alive', Thrift.Type.BOOL, 1);
    output.writeBool(this.alive);
    output.writeFieldEnd();
  }
  if (this.processing !== null && this.processing !== undefined) {
    output.writeFieldBegin('processing', Thrift.Type.BOOL, 2);
    output.writeBool(this.processing);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var Exception = module.exports.Exception = function(args) {
  Thrift.TException.call(this, "Exception");
  this.name = "Exception";
  this.what = null;
  this.why = null;
  if (args) {
    if (args.what !== undefined && args.what !== null) {
      this.what = args.what;
    }
    if (args.why !== undefined && args.why !== null) {
      this.why = args.why;
    }
  }
};
Thrift.inherits(Exception, Thrift.TException);
Exception.prototype.name = 'Exception';
Exception.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.what = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.why = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Exception.prototype.write = function(output) {
  output.writeStructBegin('Exception');
  if (this.what !== null && this.what !== undefined) {
    output.writeFieldBegin('what', Thrift.Type.STRING, 1);
    output.writeString(this.what);
    output.writeFieldEnd();
  }
  if (this.why !== null && this.why !== undefined) {
    output.writeFieldBegin('why', Thrift.Type.STRING, 2);
    output.writeString(this.why);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var EventInPastException = module.exports.EventInPastException = function(args) {
  Thrift.TException.call(this, "EventInPastException");
  this.name = "EventInPastException";
  this.timestamp = null;
  if (args) {
    if (args.timestamp !== undefined && args.timestamp !== null) {
      this.timestamp = args.timestamp;
    }
  }
};
Thrift.inherits(EventInPastException, Thrift.TException);
EventInPastException.prototype.name = 'EventInPastException';
EventInPastException.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.I64) {
        this.timestamp = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

EventInPastException.prototype.write = function(output) {
  output.writeStructBegin('EventInPastException');
  if (this.timestamp !== null && this.timestamp !== undefined) {
    output.writeFieldBegin('timestamp', Thrift.Type.I64, 1);
    output.writeI64(this.timestamp);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};
