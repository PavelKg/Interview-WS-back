const url     = require("url") 
const Routes  = require("./routes")
const auth    = require("./auth")
const dbPoll  = require("./db")
const utils   = require("./utils")

const app = {
    user: {},
    db:  new dbPoll(),
    // host: '',
    // http: 'http'
};

const routes = new Routes(app);

let server = function (request, response) {
    const { headers, method } = request;
    const _url = url.parse(request.url, true),
          pathname = _url.pathname,
          query = _url.query;

    app.host = headers.host;
    // for OPTIONS type
    //response.setHeader("Access-Control-Allow-Origin", "*");
    //response.setHeader("Access-Control-Allow-Headers", "content-type, accept, authorization");
    //response.setHeader("Access-Control-Allow-Methods", "*");

    // if (method === 'OPTIONS') {
    //     response.end();
    //     return false;
    // }
    
    auth.login(headers).then( result => {
        const client_ip = request.connection.remoteAddress;
        const {user, accept} = result;
        console.log('%s: client:%s; pathname:%s', '[' + new Date().toUTCString() + '] ', client_ip, pathname)
        const session = {
            user: user,
            res:  response
        };

        //app.user = user;
        //app.res = response;

        const route = routes.createChild(session, pathname);
        switch (method) {
            case "GET":
                routes.get(route, query);                
                break;
            case "POST":        
                routes.post(route, query);
                break;
        }
    },
    error=>{
        console.log('------------------------ error --------------------------')
        const { code=404, status='undefined', error_code=100 } = error;
        console.log(error)
        const answer = { res: response, code: code, body: JSON.stringify(
            { code, status, error_code }
        )};            
        utils.response( answer);
        return false;
    })
}

module.exports = server;


