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
    console.log("comnmnected" + socket.id);
    socket.on('sphereEqs', msg => {
        console.log("innnn");
        handleUpdatedEquations(socket, msg);
    });
    socket.on('cylinderEqs', msg => {
        handleUpdatedEquations(socket, msg);
    });
    socket.on('deleteEqs', msg => {
        handleDeleteEquations(socket, msg);
    });
});

var currEquations = {};

function handleDeleteEquations(socket, id) {
    io.sockets.emit('deleteShape', id);
}

// callback function when equations are updated on web
function handleUpdatedEquations(socket, equations) {
    currEquations[equations.id] = equations;

    console.log("getting equations...");
    var type = equations.type;

    if (type == 'sphere') {
        var r = equations.radius;
        var r_squared = Math.pow(r, 2);
        var radius = Math.sqrt(r_squared / equations.coef);
        var radiusMLSize = convertToMLSize(radius);
        var diameterMLSize = 2 * radiusMLSize;
        var offsets = convertToMLPosSphere(radius, equations.position);
        var leftOffset = offsets[0];
        var topOffset = offsets[1];
        var zOffset = offsets[2];

        var htmlObj = {
            src: 'sphere.16.fbx',
            style: 'width: ' + diameterMLSize + 'px; '
                + 'height: ' + diameterMLSize + 'px; '
                + 'position: absolute; '
                + 'left: ' + leftOffset + 'px; '
                + 'top: ' + topOffset + 'px;',
            "z-offset": zOffset + 'px',
            "model-scale": '1, 1, 1',
            "color": idToColor(equations.id)
        }

        html = createHTML(htmlObj);
        console.log(html);
        io.sockets.emit('equationsML', 
        {
            id: equations.id,
            html: html,
            equations: equations
        });
    } else if (type == 'cylinder') {
        var r = equations.radius
        var r_squared = Math.pow(r, 2);
        var radius = Math.sqrt(r_squared / equations.coef);
        var radiusMLSize = convertToMLSize(radius);
        var diameterMLSize = 2 * radiusMLSize;
        var height = equations.height;
        var heightMLSize = convertToMLSize(height);
        var offsets = convertToMLPosCylinder(radius, equations.bottom, height, equations.position, equations.rotationAxes);
        var leftOffset = offsets[0];
        var topOffset = offsets[1];
        var zOffset = offsets[2];
        var rotationAxes = equations.rotationAxes;

        var htmlObj = {
            src: 'cylinder.fbx',
            style: 'width: ' + diameterMLSize + 'px; '
            + 'height: ' + heightMLSize + 'px;'
            + 'left: ' + leftOffset + 'px;'
            + 'top: ' + topOffset + 'px;',
            "z-offset": zOffset + 'px',
            "model-scale": '1, 1, 1',
            "prism-rotation": rotationAxes[0] + ' ' + rotationAxes[1] + ' ' + rotationAxes[2],
            color: 'red'
        }

        html = createHTML(htmlObj);
        console.log(html);
        io.sockets.emit('equationsML', html);
    }


    console.log(equations);
    equationsField = equations;
}

function idToColor(id) {
    color = ['orange', 'purple', 'yellow', 'red', 'green', 'black', 'brown'];
    return color[id % color.length];
}

function createHTML(htmlObj) {
    var htmlStr = "";
    for (var key in htmlObj) {
        var value = htmlObj[key];
        htmlStr += `${key}='${value}' `;
    }
    var str = "<ml-model " + htmlStr + "> </ml-model>";
    return str;
}

function convertToMLSize(size) {
    return size * 100;
}

function convertToMLPosSphere(radius, posArr) {
    var result = []
    // origin at 550px, 550px, ?px;
    result.push(550 - convertToMLSize(radius) + convertToMLSize(posArr[0])); // x axis
    result.push(550 - convertToMLSize(radius) + convertToMLSize(posArr[1])); // y axis
    result.push(150 + convertToMLSize(posArr[2])); // z axis
    return result;
}

function convertToMLPosCylinder(radius, bottom, height, posArr, rotationAxes) {
    var result = []
    // origin at 550px, 550px, ?px;
    // towards us, away from us
    // TODO: Make sure flipping away from us
    if (rotationAxes[0] == '90deg') {
        result.push(550 - convertToMLSize(radius) + convertToMLSize(posArr[0])); // x axis
        result.push(550 - convertToMLSize(height) + convertToMLSize(posArr[1])); // y axis
        result.push(150 + convertToMLSize(bottom)); // z axis
    // sideways
    // TODO: Make sure flipping to the right
    } else if (rotationAxes[2] == '90deg') {
        result.push(550 - convertToMLSize(radius) + convertToMLSize(bottom)); // x axis
        result.push(550 - convertToMLSize(height) + convertToMLSize(posArr[0])); // y axis
        result.push(150 + convertToMLSize(posArr[1])); // z axis
    // up down
    } else {
        result.push(550 - convertToMLSize(radius) + convertToMLSize(posArr[0])); // x axis
        result.push(550 - convertToMLSize(height) + convertToMLSize(bottom)); // y axis
        result.push(150 + convertToMLSize(posArr[1])); // z axis
    }
    return result;
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
