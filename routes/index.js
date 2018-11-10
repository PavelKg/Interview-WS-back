const utils     = require("../utils")
const root   = require("./root")
const login   = require("./login")

let answer = {}; 
class Route {
  constructor (app) {     
    this.app = app;
    this.routing = { 
        ["/"]: root,
        ["/api/login/"]: login,
    };
  } 
  createChild(_session, _pathname) {

    const path = _pathname[_pathname.length-1]!=="/"? _pathname+="/" : _pathname;

    if (this.routing[path]==undefined){
      answer = { 
        res: _session.res,
        code: 404,
        type: "json",
        body: JSON.stringify({ "code": this.code, status:`Sorry, route ${path} not found`})
      };
      utils.response(answer);
      return;
    }

    try {
      const inst = new this.routing[path](this.app, _session)
      return inst
    } catch(err){
      answer = { 
        res: _session.res, 
        code: 500, 
        type: "json", 
        body: JSON.stringify({ code: this.code, status: `internal server error ${err}` })
      };
      utils.response(answer);
      return
    }
  }
  
  get(_route, _query) {
    _route.getData(_query);
    return false;
    //utils.response(answer);
  };
  
  post (_query) {
    return false;
  };
};  

module.exports = Route;