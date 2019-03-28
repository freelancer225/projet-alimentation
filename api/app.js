require('babel-register');

const {success, error, checkAndChange} = require('./assets/function');

const mysql = require('promise-mysql')

const bodyParser = require('body-parser')
const express = require('express')
const morgan = require ('morgan')('dev')
const config = require('./assets/config')


const app = express ();

mysql.createConnection({
	host: config.db.host,
	database: config.db.database,
	user: config.db.user,
	password: config.db.password
}).then((db) => {

	console.log('connected.')

		const app = express ()

		let RecettesRouter = express.Router()
		let Recettes = require('./assets/classes/members-class')(db,config)

		app.use(morgan)
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true}));

		RecettesRouter.route('/:id')

		//Récupère un membre avec son id
			.get(async (req, res) => {
				let recette = await Recettes.getByID(req.params.id)
				res.json(checkAndChange(recette))
			})


		// Modifie un membre avec son id
			.put(async (req, res) => {
				let updateRecette = await Recettes.update(req.params.id, req.body.name, req.body.image, req.body.cuisine)
				res.json(checkAndChange(updateRecette))	
			})


		//Supprime un membre avec son ID
			.delete(async (req, res)=> {
				let deleteRecette = await Recettes.delete(req.params.id)
				res.json(checkAndChange(deleteRecette))		
			})

		RecettesRouter.route('/')

			//Récupère tous les membres
			.get( async(req, res) => {
				
				let allRecettes = await Recettes.getAll(req.query.max)
				res.json(checkAndChange(allRecettes))
			})

			//Ajoute un membre avec son nom
			.post(async (req, res)=>{
				let addRecette = await Recettes.add(req.body.name, req.body.cuisine, req.body.image)
				res.json(checkAndChange(addRecette))


			})

		app.use(config.rootAPI+'recettes' , RecettesRouter)

		app.listen(config.port, () => console.log('started'))

		

}).catch((err)=>{
	console.log('Erreur during database connection')
	console.log(err.message)
})

