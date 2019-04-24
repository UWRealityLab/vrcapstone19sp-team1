var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/a', (req, res) => res.sendFile(__dirname + '/magicleap.html'));

var equationsField = [];

/// --------------------------
/// SERVER <--> CLIENT WEBSITE
io.on('connection', function (socket) {
    console.log("comnmnected");
    socket.on('sphereEqs', msg => {
        console.log("innnn");
        handleUpdatedEquations(msg);
    });
    socket.on('cylinderEqs', msg => {
        handleUpdatedEquations(msg);
    });
});

// callback function when equations are updated on web
function handleUpdatedEquations(equations) {
    console.log("getting equations...");
    console.log(equations);
    equationsField = equations;
}

function updateEquationsOnWebsite(equations) {
    socket.emit('equations', equations);
}

// client posts to give server the updated equations
app.post('/sphereEqs', function (req, res) {
    console.log("hola1");
    console.log(res);
});

app.post('/cylinderEqs', function (req, res) {
    console.log("hola2");
    console.log(res);
});

// client website calls this to get the updated set of equations
app.get('/getUpdatedEquations', (req, res) => {
    res.send(["y=x", "y=x^2"]);
});

/// --------------------------
/// MAGIC LEAP <--> SERVER
// magic leap posts to this with the changes on the magic leap (representation of changes depends
// on how the meshes are rendered)
// TODO: implement later as we add interactions
app.post('/makeChanges', function (req, res) {
    console.log(res);
});

// magic leap calls this to get an array of mesh representations
// TODO: Tanuj and Esteban will need to implement this to convert from equation --> mesh representation
app.get('/displayEquation', function (req, res) {
    // sends an array of mesh representations
    res.send(equationsField);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000
// app.listen(port, () => console.log("App running on port " + port))

server.listen(port, function(){
  console.log('listening on ' + port);
});

module.exports = app;
