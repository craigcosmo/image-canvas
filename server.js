'use strict'

const express = require( 'express' );
const multer = require( 'multer' );
const fs = require( 'fs' );
const junk = require( 'junk' );
let app = express();
var formidable = require('formidable');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use( express.static('./') );
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// define file name and destination to save
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __dirname +  '/images')
	},
	filename: (req, file, cb) => {
		let ext = file.originalname.split( '.' );
		ext = ext[ext.length - 1];
		cb(null, 'uploads-' + Date.now() + '.' + ext);
	}
});

// define what file type to accept
let filter = ( req, file, cb ) => {
	if ( file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' ) {
		cb( null, true );
	} else {
		cb( 'Failed: format not supported' );
	}
}

// set multer config
let upload = multer( {
	storage: storage,
	fileFilter: filter
}).single( 'upload' );

/* ===============================
	ROUTE
 ============================== */

// route for file upload
app.post( '/uploads', ( req, res ) => {
	
	// create an incoming form object
	var form = new formidable.IncomingForm();

	// specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;

	// store all uploads in the /uploads directory
	form.uploadDir = path.join(__dirname, '/uploads');

	// every time a file has been uploaded successfully,
	// rename it to it's orignal name
	form.on('file', function(field, file) {
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});

	// log any errors that occur
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function() {
		res.end('success');
	});

	// parse the incoming request containing the form data
	form.parse(req);

})
app.post('/delete', (req,res) =>{
	// console.log(req.body.id)
	let id = req.body.id
	deleteImage(id,res)
})
function deleteImage(id, res){
	fs.unlink('uploads/'+id, function(){
		res.end('success')
	})
}
app.get( '/uploads', ( req, res ) => {
	let file_path = req.protocol + '://' + req.get('host') + '/uploads/';
	let files = fs.readdirSync( './uploads/' );
	files = files
					.filter( junk.not ) // remove .DS_STORE etc
					.map( f => file_path + f ); // map with url path
	res.json( files );
});

// general route
app.get( '/', ( req, res ) => {
	res.sendFile( __dirname + '/index.html' );
})

var server = app.listen( 8000, _ => {
	console.log( 'server started. listening to 8000' );
})
