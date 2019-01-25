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
			const { company_id, personal_id } = this.session.user
			this.acc =  {company: company_id, user: personal_id}
	}

	error_mes (err) {
		return JSON.stringify({code: 400, type: 'text', data: {name: err.name, message: err.message}})
	}

	async get(query) { // get list comanies
		let answer = this.answer

		try { 
			const data = await this.app.db.query(`select company_list($1::json) dates`,
			[JSON.stringify(this.acc)]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw Error("Data not found !!!")
			}
			const companies = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, type: 'hypercube',  data: companies }) }

		} catch(err) {
			answer = {...answer, body: this.error_mes(err)}

		}	finally {
			utils.response(answer);
		}
	}
	
	async post(query) { // add company
		let answer = this.answer
		try { 
			const {company_data} =  JSON.parse(query)
			const data = await this.app.db.query(`select company_add($1::json, $2::JSON) dates`, 
			[JSON.stringify(this.acc), company_data]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw Error("Data not found !!!")
			}
			const add_res = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, type:'text', data: {...add_res} }) }
		} catch(err) {
			answer = {...answer, body: this.error_mes(err)}
		}	finally {
			utils.response(answer);
		}
	}
	
	async put(query) { // edit company
		let answer = this.answer
		//console.log(query)
		try { 
			const {company_id, company_data} =  JSON.parse(query)
			const data = await this.app.db.query(`select company_upd($1::json, $2, $3::JSON) dates`, 
			[JSON.stringify(this.acc), Number(company_id), company_data]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw Error("Data not found !!!")
			}
			const upd_res = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, type:'text', data: {...upd_res} }) }
		} catch(err) {
			answer = {...answer, body: this.error_mes(err)}
		}	finally {
			utils.response(answer);
		}
	}


	async delete(query) { // add company
		let answer = this.answer
		try { 
			const {company_id} =  JSON.parse(query)
			const data = await this.app.db.query(`select company_del($1::json, $2::int) dates`, 
			[JSON.stringify(this.acc), Number(company_id)]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw Error("Data not found !!!")
			}
			const del_res = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, type:'text', data: {...del_res} }) }
		} catch(err) {
			answer = {...answer, body: this.error_mes(err)}
		}	finally {
			utils.response(answer);
		}
	}

}

module.exports = companies