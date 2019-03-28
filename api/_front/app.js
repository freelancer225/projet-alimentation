//Modules

require('babel-register')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')('dev')
const twig = require('twig')

//Variables globales
const app = express()
const port = 8081

//Middlewares
app.use(morgan)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));



//Routes
app.get('/', (req,res) =>{

	res.render('index.twig', {
		name : 'Lucie'
	})
})

app.get('/members', (req, res) =>{

	
})

//Lancement de l'application
app.listen(port,() => console.log('Started on port' + port))