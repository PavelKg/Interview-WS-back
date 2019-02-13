const utils     = require("../utils")
const root      = require("./root")
const login     = require("./login")
const user      = require("./user")
const companies = require("./companies")
const administrators = require("./administrators")
const videos    = require("./videos")


let answer = {}; 
class Route {
  constructor (app) {     
    this.app = app;
    this.routing = { 
        ["/"]: root,
        ["/api/login/"]: login,
        ["/api/user/"]: user,        
        ["/api/companies/"]: companies,        
        ["/api/administrators/"]: administrators,                
        ["/api/videos/"]: videos,                
    };
  } 
  createChild(_session, _pathname) {
    console.log('_pathname=',_pathname)
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
};  

module.exports = Route;

