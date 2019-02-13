"use strict";
const utils = require("../utils")

class videos {
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
		return JSON.stringify({code: 400, type: 'text', data: {result: err.name, message: err.message}})
	}

	async get(query) { // get list administrators
		let answer = this.answer

		try { 
			const data = await this.app.db.query(`select videos_list($1::json) dates`,
			[JSON.stringify(this.acc)]);

			if (data.rows.length == 0 || data.rows[0].dates == null) {
				throw Error("Data not found !!!")
			}
			const users = JSON.parse(JSON.stringify(data.rows[0].dates))
			answer = {...answer, body: JSON.stringify({code: 200, type: 'hypercube', data: users }) }

		} catch(err) {
			answer = {...answer, body: this.error_mes(err)}

		}	finally {
			utils.response(answer);
		}
	}
	
	async post(query) { // add users
		let answer = this.answer
		try { 
			const {user_data} =  JSON.parse(query)
			const data = await this.app.db.query(`select user_add($1::json, $2::JSON) dates`, 
			[JSON.stringify(this.acc), JSON.stringify(user_data)]);

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

	async put(query) { // edit user
		let answer = this.answer
		//console.log(query)
		try { 
			const {user_id, user_data} =  JSON.parse(query)
			const data = await this.app.db.query(`select user_upd($1::json, $2, $3::JSON) dates`, 
			[JSON.stringify(this.acc), Number(user_id), JSON.stringify(user_data)]);

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


	async delete(query) { // delete user
		let answer = this.answer
		try { 
			const {user_id} =  JSON.parse(query)
			const data = await this.app.db.query(`select user_del($1::json, $2::int) dates`, 
			[JSON.stringify(this.acc), Number(user_id)]);

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

module.exports = videos