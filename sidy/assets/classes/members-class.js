// let db, config

// module.exports = (_db, _config) =>{
// 	db = _db
// 	config = _config
// 	return Recettes
// };

// let Recettes = class {

// 	static getByID(id){

// 		return new Promise((next) => {
// 			db.query('SELECT * FROM recettes WHERE id = ?',[id])
// 			.then((result) => {

// 				if (result[0] != undefined) {
// 					next(result[0])
// 				}else{
// 					next(new Error(config.errors.wrongID))
// 				}

// 			})
// 			.catch((err) => next(err))

// 		})

		
// 	}

// 	static getAll(max){

// 		return new Promise((next) => {

// 			if (max != undefined && max > 0) {

// 				db.query('SELECT * FROM recettes LIMIT 0, ?', [parseInt(max)])
// 					.then((result) => next(result))
// 					.catch((err) => next(err))

// 			}else if (max != undefined) {
// 				next(new Error(config.errors.wrongMaxValue))	
// 			}

// 			else{
// 				db.query('SELECT * FROM recettes')
// 					.then((result) => next(result))
// 					.catch((err) => next(err))

// 			}

// 		})
// 	}

// 	static add(name, cuisine){

// 		return new Promise ((next) => {
// 			if (name != undefined && name.trim() != '') {

// 					name = name.trim()

// 					db.query('SELECT * FROM recettes WHERE name = ? cuisine = ?', [name, cuisine])
// 						.then((result) => {

// 							if (result[0] != undefined) {
// 								next( new Error (config.errors.nameTaken))
								
// 							}else{
// 								return db.query('INSERT INTO recettes(name, cuisine) VALUES(?, ?)', [name],[cuisine])
// 							}
// 						})

// 						.then(() => {
// 							return db.query('SELECT * FROM recettes WHERE name =? cuisine = ?', [name, cuisine])
							
// 						})
// 						.then((result) => {
// 							next({
// 								id: result[0].id,
// 								name: result[0].name,
// 								cuisine: result[0].cuisine

// 							})
// 						})
// 						.catch((err) => next(err))
// 						console.log(err)

// 				}else{
// 					next(new Error(config.errors.noNameValue))
// 				}
// 		})
// 	}

// 	static update(id, name){

// 		return new Promise((next) => {

// 			if (name != undefined && name.trim() != '') {

// 				name = name.trim()


// 				db.query('SELECT * FROM recettes WHERE id = ?', [id])
// 					.then((result) => {

// 						if (result[0] != undefined) {
// 							return db.query('SELECT * FROM recettes WHERE name = ? AND id != ?', [name, id])
// 						}else{
// 							next (new Error(config.errors.wrongID))								
// 						}
// 					})
// 					.then((result) => {
// 						if(result[0] != undefined){
// 							next(new Error(config.errors.sameName))
							
// 						}else {
// 							return db.query('UPDATE recettes SET name = ? WHERE id = ?', [name, id])
// 						}
// 					})
// 					.then(() => next(true))
// 					.catch((err) => next(err))


// 			}else {
// 				next(new Error(config.errors.noNameValue))
// 			}
// 		})
// 	}

// 	static delete(id){

// 		return new Promise((next)=>{

// 			db.query('SELECT * FROM recettes WHERE id = ?', [id])
// 				.then((result) => {
// 					if (result[0] != undefined) {
// 						return  db.query('DELETE FROM recettes WHERE id= ?', [id])		
// 					}else{
// 						next(new Error(config.errors.wrongID))
// 					}
// 				})
// 				.then(() => next(true) )
// 				.catch((err) => next(err))
// 		})
// 	}

// }