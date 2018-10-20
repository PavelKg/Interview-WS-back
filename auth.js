const jwt = require("jsonwebtoken");
const config = require("./config"); 
const appKey = config.secret;

let auth = {}

const getAutError = (err_name) => {
    let err_def = { code: 403, status: err_name, error_code: 99};
    const auth_err = {
        ['jwt expired']: { code: 403, status: 'access token expired', error_code: 2 },
        ['header auth not found']: { code: 403, status: 'header auth not found', error_code: 2 },
        ['header auth not correct']: { code: 403, status: 'header auth not correct', error_code: 2 },
        ['struct of token is not correct']: { code: 403, status: 'format of token is not correct', error_code: 2}
    }

    if (auth_err.hasOwnProperty(err_name)) {
        err_def = auth_err[err_name];
    }
    return err_def;
}

const verify_auth_header = headers => {
    if (headers && headers.authorization) {
        const split = headers.authorization.split(' ');
        if (split.length === 2) return split[1];
        else { throw getAutError("header auth not correct"); };
    } else { 
        throw  getAutError('header auth not found');
    }
}    

auth.login = async (headers) => {
    let answ = {};
    try {
        const token = await verify_auth_header(headers);
        answ.accept = headers.accept || {}; 

        await jwt.verify(token, appKey, (err, decoded) => { //JWT test
           if (err) { // IF JWT TEST IS ERROR
               throw getAutError(err.message);
           }
           //JWT TEST IS OK
            if (decoded.hasOwnProperty("user")) {
                answ.user = decoded.user;
            }else{
                throw getAutError("struct of token is not correct");
            }
           
        })
        return answ;
    } catch(error) {
        throw error;
    }    
}

module.exports = auth