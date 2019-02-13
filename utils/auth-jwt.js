const jwt = require("jsonwebtoken")
const config = require("../config") 
const appKey = config.secret

JWT = {}

const header = { 	algorithm: "HS512" } 
let payload = {
	user: {
		personal_id: "",
		company_id: "",
		personal_role: "",
	},
	exp: 0,
	iat: 0,
	iss: "pepex.kg/api",
};

JWT.gen = (user_props) => {
	const exp = Math.floor(Date.now().valueOf() / 1000) + 720 * 60
	const iat = Math.floor(Date.now() / 1000)
	payload = {...payload, user: user_props, exp, iat}
	const token = jwt.sign(payload, appKey, header)
	console.log
	return token
}

module.exports = JWT
