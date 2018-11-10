"use strict";
const crypto = require('crypto')
const utils = require("../utils")
const jwt = require("../utils/auth-jwt")

class login {
	constructor(app, session) {
			this.app = app;
			this.session = session;
	}

	async post(query) {
		let answer = { 
			res: this.session.res,
			code: 200,
			body: ''
		}

		try { 
			const jsonQuery = JSON.parse(query);
			console.log(query)
			const {personal_id, company_id, password} = jsonQuery
			if (!personal_id || !company_id || !password ) {
				throw new Error("Need more data!!!")
			}
			const hash = await crypto.createHash ('sha256').update (password).digest ('hex')
			const data = await this.app.db.query(`select * from login($1::text, $2, decode($3::text, 'hex')) dates`, 
			[personal_id, company_id, hash]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw new Error("Auth data is not correct !!!")
			}

			const jwtData = JSON.parse(JSON.stringify(data.rows[0].dates))
			const user = {personal_id: jwtData.personal_id, company_id: jwtData.company_id, role: jwtData.role} 
			const token = jwt.gen(user)
			answer = {...answer, body: JSON.stringify({code: 200, token: token }) }

		} catch(err) {
			answer = {...answer, body: JSON.stringify({code: 400, error: err.message})}

		}	finally {
			utils.response(answer);
		}
	}		
}

module.exports = login