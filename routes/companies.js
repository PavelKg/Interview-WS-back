"use strict";
const utils = require("../utils")

class companies {
	constructor(app, session) {
			this.app = app;
			this.session = session;
			this.answer = { 
				res: this.session.res,
				code: 200,
				body: ''
			}
	}

	async get(query) { // get list comanies
		try { 
			const data = await this.app.db.query(`select company_list() dates`);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw new Error("User not found !!!")
			}
			const companies = JSON.parse(JSON.stringify(data.rows[0].dates))
			this.answer = {...this.answer, body: JSON.stringify({code: 200, company_list: companies }) }

		} catch(err) {
			this.answer = {...this.answer, body: JSON.stringify({code: 400, error: err.message})}

		}	finally {
			utils.response(this.answer);
		}
	}
	
	async post(query) { // add company
		try { 
			const {name, description} =  query
			const data = await this.app.db.query(`select company_add($1::text, $2::text) dates`, 
			[name, description]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw new Error("User not found !!!")
			}

			const add_res = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, result: add_res }) }

		} catch(err) {
			answer = {...answer, body: JSON.stringify({code: 400, error: err.message})}

		}	finally {
			utils.response(answer);
		}
	}
	
	async put(query) { // change company data
		try { 
			const {personal_id, company_id} =  this.session.user
			const data = await this.app.db.query(`select user_info($1::text, $2) dates`, 
			[personal_id, company_id]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw new Error("User not found !!!")
			}

			const userRole = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, user_info: userRole }) }

		} catch(err) {
			answer = {...answer, body: JSON.stringify({code: 400, error: err.message})}

		}	finally {
			utils.response(answer);
		}
	}		
	async delete(query) { // delete company
		try { 
			const {personal_id, company_id} =  this.session.user
			const data = await this.app.db.query(`select user_info($1::text, $2) dates`, 
			[personal_id, company_id]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw new Error("User not found !!!")
			}

			const userRole = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, user_info: userRole }) }

		} catch(err) {
			answer = {...answer, body: JSON.stringify({code: 400, error: err.message})}

		}	finally {
			utils.response(answer);
		}
	}		

}

module.exports = companies