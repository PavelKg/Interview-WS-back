"use strict";
const utils = require("../utils")
const jwt = require("../utils/auth-jwt")


class login {
	constructor(app, session) {
			this.app = app;
			this.session = session;
	}

	async post(query) {

		const {personal_id, company_id, password} = query
		let answer = { 
			res: this.session.res,
			code: 200,
			body: ""
			};
		
		try {
			if (!personal_id || !company_id || !password ) {
				throw "Отсутсвуют необходимые данные!!!"
			}
			
			const data = await this.app.db.query(`select login($1, $2, decode($3, 'hex')) dates`, 
			[personal_id, company_id, passhash]);			
			console.log(data.rows[0].dates)
			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw "Data of user not found!!!"
			}
			const user = {personal_id: personal_id ,company_id: company_id,}
			const token = jwt.gen(user)
			answer = {...answer, body: JSON.stringify({code:200, token:token }) }
		
		} catch(err) {
			answer = {...answer, body: JSON.stringify({code:400, error:err})}
		}	
		utils.response(answer);
	}		
}

module.exports = login