"use strict";
const utils = require("../utils");

class root {
    constructor(app, session){
        this.app = app;
        this.session = session;
    }

    async getData(){
        let answer = { 
            res: this.session.res,
            code: 200,
            body: JSON.stringify({code:200, info:"App ver:1.0" })
            };
        utils.response(answer);
    }
}

module.exports = root



