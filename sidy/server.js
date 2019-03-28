require('babel-register');
const {success, error, checkAndChange} = require('./assets/function');

const config = require('./assets/config');

const mysql = require('promise-mysql');
const twig = require('twig');
/* # */

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 8084;

var passport = require('passport');
var flash = require('connect-flash');

require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('view engine', 'ejs');

app.use(session({
	secret: 'justasecret',
	resave: true,
	saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



//

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
				let updateRecette = await Recettes.update(req.params.id, req.body.name)
				res.json(checkAndChange(updateRecette))	
			})


		//Supprime un membre avec son ID
			.delete(async (req, res)=> {
				let deleteRecette = await Recettes.delete(req.params.id)
				res.json(checkAndChange(deleteRecette))		
			})

		RecettesRouter.route('/profile')

			//Récupère tous les membres
			.get( async(req, res) => {
				
				let allRecettes = await Recettes.getAll(req.query.max)
				res.json(checkAndChange(allRecettes))
			})

			//Ajoute un membre avec son nom
			.post(async (req, res)=>{

				let addMember = await Recettes.add(req.body.name)
				res.json(checkAndChange(addMember))

			})

		app.use(config.rootAPI+ 'recettes' , RecettesRouter)

}).catch((err)=>{
	console.log('Erreur during database connection')
	console.log(err.message)
})

require('./app/routes.js')(app, passport);




app.listen(port);
console.log("Port: " + port);