const jwt = require("jsonwebtoken")
const config = require("../config") 
const appKey = config.secret

JWT = {}

const header = { 	algorithm: "HS512" } 
let payload = {
	user: {
		personal_id: "",
		company_id: "",
	},
	exp: Math.floor(Date.now() / 1000) + 720 * 60,
	iat: Math.floor(Date.now() / 1000),
	iss: "pepex.kg/api",
};

JWT.gen = (user_props) => {
	payload = {...payload, user: user_props}
	const token = jwt.sign(payload, appKey, header)
	console.log
	return token
}

module.exports = JWT
