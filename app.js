const url = require("url")
const Routes = require("./routes")
const auth = require("./auth")
const dbPoll = require("./db")
const utils = require("./utils")

const app = {
    user: {},
    db: new dbPoll(),
    // host: '',
    // http: 'http'
};

const routes = new Routes(app);

let server = function (request, response) {
    const { headers, method } = request;
    const _url = url.parse(request.url, true)
    const pathname = _url.pathname
    const query = _url.query

    app.host = headers.host;
    // for OPTIONS type
    //response.setHeader("Access-Control-Allow-Origin", "*");
    //response.setHeader("Access-Control-Allow-Headers", "content-type, accept, authorization");
    //response.setHeader("Access-Control-Allow-Methods", "*");

    // if (method === 'OPTIONS') {
    //     response.end();
    //     return false;
    // }

    const client_ip = request.connection.remoteAddress;
    const session = {
        user: '',
        res: response
    };

    if (pathname.match('^/api/login[\/]*$')) {
        const auth_route = routes.createChild(session, pathname);
        if (typeof auth_route[method.toLowerCase()] !== 'function') {
					const error_text =`request method '${method}' not found`
					const answer = {
						res: response, code: 200, body: JSON.stringify({ code: 200, status: 'error', error_code: error_text })
					}
					utils.response(answer);					
					return
        }
        auth_route[method.toLowerCase()](query);
    } else {
        auth.login(headers).then(result => {
            const { user, accept } = result;
            console.log('%s: client:%s; pathname:%s', '[' + new Date().toUTCString() + '] ', client_ip, pathname)
            session.user = user;
            //app.user = user;
            //app.res = response;
            const route = routes.createChild(session, pathname);
            route[method.toLowerCase()](query);
        },
            error => {
                console.log('------------------------ error --------------------------')
                const { code = 404, status = 'undefined', error_code = 100 } = error;
                console.log(error)
                const answer = {
                    res: response, code: code, body: JSON.stringify(
                        { code, status, error_code }
                    )
                };
                utils.response(answer);
                return false;
            })
    }
}

module.exports = server;


