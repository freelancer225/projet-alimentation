require('babel-register')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')('dev')
const twig = require('twig')
const axios = require('axios')

const multer = require('multer');
const storage = multer.diskStorage({
	destination : function(req, file, cb){
		cb(null, './uploads/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().getTime() +  file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype ==='image/jpeg' || file.mimetype ==='image/png') {
		cb(null, true);
	}else {
		cb(null, false);
	}
};
const upload = multer({
	storage: storage, 
	limits: {
		filesize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

//Variables globales
const app = express()

const fetch = axios.create({
	baseURL: 'http://localhost:8082/api/v1',
	
});

//Middlewares
app.use(morgan)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


module.exports = function (app, passport) {

	app.get('/', (req, res) =>{
		apiCall(req.query.max ? '/recettes?max='+req.query.max : '/recettes', 'get', {}, res, (result) => {
			res.render('index.twig', {
				recettes: result 
			})
		})
	})
	app.get('/', function(req, res){
		res.render('index.twig');
	
	});

	app.get('/login', function(req, res){
		if (req.isAuthenticated()){ 
			res.redirect('/profile') 
		} else {res.render('login.ejs', {message: req.flash('loginMessage')})};
	
		
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect:'/profile',
		failureRedirect:'/login',
		failureFlash: true
	}),
		function(req,res){
			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			}else{
				req.session.cookie.expires = false;
			}
			res.redirect('/')
		});

	app.get('/signup', function(req, res){
		if (req.isAuthenticated()){ 
			res.redirect('/profile') 
		} else {res.render('signup.ejs', {message: req.flash('signupMessage')})};
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect:'/profile',
		failureRedirect:'/signup',
		failureFlash: true
	}));


	app.get('/profile', function(req, res){
		res.render('profile.ejs', {
			user:req.user
		});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	})

	app.get('/recettes', (req, res) =>{
		apiCall(req.query.max ? '/recettes?max='+req.query.max : '/recettes', 'get', {}, res, (result) => {
			res.render('recettes.twig', {
				recettes: result 
			})
		})
	})

	app.get('/insert', (req, res) => {
		res.render('insert.twig')
	})

	//Methode d'ajout
	app.post('/insert', (req, res) => {
		console.log(req.body.name, req.body.cuisine);
		console.log(req.body.filename)
		apiCall('/recettes','post', {name :req.body.name, image: req.body.image, cuisine: req.body.cuisine}, res, (result) => {
			
			res.redirect('/recettes')

		});
	})

	//Page gérant la modification d'un membre
	app.get('/edit/:id', (req, res) => {
		apiCall('/recettes/'+req.params.id, 'get',{}, res, (result) => {
			res.render('edit.twig', {
				member: result
			})
		})
	})

	app.post('/edit/:id', (req, res) => {
		apiCall('/recettes/'+req.params.id, 'put', {
			name: req.body.name,			
			image: req.body.image,
			cuisine: req.body.cuisine
		}, res, () => {
			res.redirect('/recettes')
		})
	})

//Methode de suppresion d'un memebre
app.post('/delete', (req, res) => {
	apiCall('/recettes/'+req.body.id, 'delete', {}, res, () => {
		res.redirect('/recettes')
	})
})

app.use(express.static(__dirname + './uploads'));

 app.get("uploads", function(req, res) {
     res.sendFile(__dirname + "./uploads");
 });



	
};

function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		return next();

	res.redirect('/');
}

// function logged(req, res, next){
// 	if(req.isAuthenticated()){

// 	}
function renderError(res, errMsg) {
	res.render('error.twig', {
				errorMsg : errMsg
			})
}

		

function apiCall(url, method, data, res, next){
	fetch({
		method: method,
		url: url,
		data: data
	}).then((response) => {

		if (response.data.status == 'success') {
			next(response.data.result)
		}else{
			renderError(res, response.data.message)
		}

	})
	.catch((err) => renderError(res,err.message))
}


