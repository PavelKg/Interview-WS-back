const url = require("url")
const Routes = require("./routes")
const auth = require("./auth")
const dbPoll = require("./db")
const utils = require("./utils")

const app = {
    user: {},
    db: new dbPoll(),
};

let answer = {
    res: null, 
    code: 200, 
    body: ''
}

const routes = new Routes(app);

const setQuery = (request) => {
    return new Promise((resolve, reject) => {
        const { method } = request
        const _url = url.parse(request.url, true)
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
            let body = '';
            request.on('data', function (data) {
                body += data;
                if (body.length > 1e6)
                    request.connection.destroy();
            });
            request.on('end', function () {
              resolve(body)
            });
        } else if (method === 'GET') {
            resolve(_url.query)
        }
    })
}

let server = function (request, response) {
    const { headers, method } = request;
    const _url = url.parse(request.url, true)
    const pathname = _url.pathname
    const client_ip = request.connection.remoteAddress;
    const session = {
        user: '',
        res: response
    };
    
    app.host = headers.host;
    answer.res = response

    response.setHeader("Access-Control-Allow-Headers", "content-type, accept, authorization");
    response.setHeader("Access-Control-Allow-Methods", "*");

    if (method === 'OPTIONS') {
        response.end();
        return false;
    }

    if (pathname.match('^/api/login[\/]*$')) {
        const auth_route = routes.createChild(session, pathname);
        if (typeof auth_route[method.toLowerCase()] !== 'function') {
            const error_text =`request method '${method}' not found`
            answer.body = JSON.stringify({ code: 400, status: 'error', error_code: error_text })
            utils.response(answer);					
            return
        }
        setQuery(request).then((query) => {
            auth_route[method.toLowerCase()](query)
        })
    } else {
        auth.login(headers).then(result => {
            const { user, accept } = result;
            session.user = user;
            const route = routes.createChild(session, pathname);
            if (typeof route[method.toLowerCase()] !== 'function') {
                const error_text =`request method '${method}' not found`
                answer.body = JSON.stringify({ code: 400, status: 'error', error_code: error_text })
                utils.response(answer);					
                return
            }            
            setQuery(request).then((query) => {            
                route[method.toLowerCase()](query)
            })
        },
            error => {
                console.log('------------------------ error --------------------------')
                const { code = 404, status = 'undefined', error_code = 100 } = error;
                console.log(error)
                answer = {...answer , code: code, body: JSON.stringify({ code, status, error_code })};
                utils.response(answer);
                return false;
            })
    }
}

module.exports = server;


