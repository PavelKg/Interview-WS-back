"use strict";
const utils = require("../utils")

class role {
	constructor(app, session) {
			this.app = app;
			this.session = session;
	}

	async get(query) {
		let answer = { 
			res: this.session.res,
			code: 200,
			body: ''
		}

		try { 
			const {personal_id, company_id} =  this.session.user
			const data = await this.app.db.query(`select userRole($1::text, $2) dates`, 
			[personal_id, company_id]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw new Error("Role is not found for user !!!")
			}

			const userRole = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, role: userRole }) }

		} catch(err) {
			answer = {...answer, body: JSON.stringify({code: 400, error: err.message})}

		}	finally {
			utils.response(answer);
		}
	}		
}

module.exports = role