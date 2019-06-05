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
    console.log("connected: " + socket.id);
    socket.on('sphereEqs', msg => {
        handleUpdatedEquations(socket, msg, true);
    });
    socket.on('cylinderEqs', msg => {
        handleUpdatedEquations(socket, msg, true);
    });
    socket.on('coneEqs', msg => {
        handleUpdatedEquations(socket, msg, true);
    });
    socket.on('ellipsoidEqs', msg => {
        handleUpdatedEquations(socket, msg, true);
    });

    socket.on('deleteEqs', msg => {
        handleDeleteEquations(socket, msg);
    });

    socket.on('deleteAllEqs', msg => {
        handleDeleteAllEquations(socket, msg);
    });

    socket.on('updateFromML', msg => {
        io.sockets.emit('equations', msg);
        handleUpdatedEquations(socket, msg, true);
    });
});

var currEquations = {};

function handleDeleteEquations(socket, id) {
    io.sockets.emit('deleteShape', id);
}

function handleDeleteAllEquations(socket, msg) {
    for (var key in currEquations){
        io.sockets.emit('deleteShape', key);
    }
}

// callback function when equations are updated on web
function handleUpdatedEquations(socket, equations, shouldEmit) {
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
            src: 'sphere1.glb',
            style: 'width: ' + diameterMLSize + 'px; '
                + 'height: ' + diameterMLSize + 'px; '
                + 'position: fixed; '
                + 'left: ' + leftOffset + 'px; '
                + 'top: ' + topOffset + 'px;',
            "z-offset": zOffset + 'px',
            "model-scale": '1, 1, 1',
            "color": idToColor(equations.id)
        }

        html = createHTML(htmlObj);
        console.log(html);
        if (shouldEmit) {
            io.sockets.emit('equationsML',
            {
                id: equations.id,
                html: html,
                equations: equations
            });
        }
    } else if (type == 'cylinder') {
        var r = equations.radius
        var r_squared = Math.pow(r, 2);
        var radius = Math.sqrt(r_squared / equations.coef);
        var height = equations.height;
        var offsetsAndRatios = convertToMLPosCylinder(radius, equations.bottom, height, equations.position, equations.rotationAxes);
        var leftOffset = offsetsAndRatios[0];
        var topOffset = offsetsAndRatios[1];
        var zOffset = offsetsAndRatios[2];
        var radiusRatio = offsetsAndRatios[3];
        var heightRatio = offsetsAndRatios[4];
        var rotationAxes = equations.rotationAxes;

        console.log(offsetsAndRatios);

        var htmlObj = {
            src: 'cylinder.glb',
            style: 'width: ' + 500 + 'px; '
            + 'height: ' + 500 + 'px; '
            + 'position: fixed; '
            + 'left: ' + leftOffset + 'px; '
            + 'top: ' + topOffset + 'px;',
            "z-offset": zOffset + 'px',
            "model-scale": radiusRatio + ', ' + heightRatio + ', ' + radiusRatio,
            "prism-rotation": rotationAxes[0] + ' ' + rotationAxes[1] + ' ' + rotationAxes[2],
            color: idToColor(equations.id)
        }

        html = createHTML(htmlObj);
        console.log(html);
        if (shouldEmit) {
            io.sockets.emit('equationsML',
            {
                id: equations.id,
                html: html,
                equations: equations
            });
        }
    } else if (type == 'ellipsoid') {
        // TODO: test if correct
        var denoms = equations.denoms;
        var offsetsAndRatios = convertToMLPosEllipsoid(denoms[0], denoms[1], denoms[2], equations.position);
        var leftOffset = offsetsAndRatios[0];
        var topOffset = offsetsAndRatios[1];
        var zOffset = offsetsAndRatios[2];

        // equations.denoms = [a, b, c]
        // (a, b, c) = model-scale
        // (1, 1, 1) = (1, 1, 1)
        // (2, 1, 1) = (1, 0.5, 0.5)
        // (1, 2, 1) = (0.5, 1, 0.5)
        // (1, 1, 0.5) = (1, 1, 0.5)
        // (2, 2, 1) = (1, 1, 0.5)
        var aRatio = offsetsAndRatios[3];
        var bRatio = offsetsAndRatios[4];
        var cRatio = offsetsAndRatios[5];

        var htmlObj = {
            src: 'sphere1.glb',
            style: 'width: ' + 500 + 'px; '
                + 'height: ' + 500 + 'px; '
                + 'position: fixed; '
                + 'left: ' + leftOffset + 'px; '
                + 'top: ' + topOffset + 'px;',
            "z-offset": zOffset + 'px',
            "model-scale": aRatio + ', ' + bRatio + ', ' + cRatio,
            "color": idToColor(equations.id)
        }

        html = createHTML(htmlObj);
        console.log(html);
        if (shouldEmit) {
            io.sockets.emit('equationsML',
            {
                id: equations.id,
                html: html,
                equations: equations
            });
        }
    } else if (type == 'cone') {
        var r = equations.radius
        var r_squared = Math.pow(r, 2);
        var radius = Math.sqrt(r_squared / equations.coef);
        var height = equations.height;
        var offsetsAndRatios = convertToMLPosCylinder(radius, equations.bottom, height, equations.position, equations.rotationAxes);
        var leftOffset = offsetsAndRatios[0];
        var topOffset = offsetsAndRatios[1];
        var zOffset = offsetsAndRatios[2];
        var radiusRatio = offsetsAndRatios[3];
        var heightRatio = offsetsAndRatios[4];
        var rotationAxes = equations.rotationAxes;
        
        if (rotationAxes[2] == '90deg') {
            rotationAxes[2] = '270deg';
        }

        var htmlObj = {
            src: 'cone.glb',
            style: 'width: ' + 500 + 'px; '
            + 'height: ' + 500 + 'px; '
            + 'position: fixed; '
            + 'left: ' + leftOffset + 'px; '
            + 'top: ' + topOffset + 'px;',
            "z-offset": zOffset + 'px',
            "model-scale": radiusRatio + ', ' + heightRatio + ', ' + radiusRatio,
            "prism-rotation": rotationAxes[0] + ' ' + rotationAxes[1] + ' ' + rotationAxes[2],
            color: idToColor(equations.id)
        }

        html = createHTML(htmlObj);
        console.log(html);
        if (shouldEmit) {
            io.sockets.emit('equationsML',
            {
                id: equations.id,
                html: html,
                equations: equations
            });
        }
    }

    console.log(equations);
    equationsField = equations;
}

function modelScaleFromDenomElipsoid(denoms) {
    denomsInts = [parseInt(denoms[0]), parseInt(denoms[1]), parseInt(denoms[2])]
    max = Math.max.apply(Math, denomsInts);
    console.log(max);
    result = [denomsInts[0] / max, denomsInts[1] / max, denomsInts[2] / max];
    console.log(result);
    return result;
}

function idToColor(id) {
    color = ['palegreen', 'cyan', 'yellow'];
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
    return size * 50;
}

function convertToMLPosSphere(radius, posArr) {
    var result = []
    // origin at 550px, 550px, ?px;
    result.push(550 - convertToMLSize(radius) + convertToMLSize(posArr[0])); // x axis
    result.push(550 - convertToMLSize(radius) - convertToMLSize(posArr[1])); // y axis
    result.push(150 + convertToMLSize(posArr[2])); // z axis
    return result;
}

function convertToMLPosEllipsoid(a, b, c, posArr) {
    var result = []
    console.log('a ' + a);
    console.log('b ' + b);
    console.log('c ' + c);
    var aRatio = convertToMLSize(a) * 2.0 / 500;
    var bRatio = convertToMLSize(b) * 2.0 / 500;
    var cRatio = convertToMLSize(c) * 2.0 / 500;
    // origin at 550px, 550px, ?px;

    // result.push(550 + 500 * aRatio / 4 + convertToMLSize(posArr[0])); // x axis
    // result.push(550 - 500 * bRatio / 4 - convertToMLSize(posArr[1])); // y axis

    // result.push(550 - 500 * aRatio / 2 + convertToMLSize(posArr[0])); // x axis
    // result.push(550 - 500 * bRatio / 2 - convertToMLSize(posArr[1])); // y axis

    // result.push(550 / 2 - 500 * aRatio / 2 + convertToMLSize(posArr[0])); // x axis
    // result.push(550 / 2 - 500 * bRatio / 2 - convertToMLSize(posArr[1])); // y axis

    result.push(550 - (250 - convertToMLSize(a)) - convertToMLSize(a) + convertToMLSize(posArr[0])); // x axis
    result.push(550 - (250 - convertToMLSize(b)) - convertToMLSize(b) - convertToMLSize(posArr[1])); // y axis
    result.push(150 + convertToMLSize(posArr[2])); // z axis
    result.push(aRatio);
    result.push(bRatio);
    result.push(cRatio);
    return result;
}

// TODO: Change model scale, XZ always same, only change Y
function convertToMLPosCylinder(radius, bottom, height, posArr, rotationAxes) {
    var diameterRatio = convertToMLSize(radius) * 2.0 / 500;
    var heightRatio = convertToMLSize(height) * 1.0 / 500;
    var result = []
    // towards us, away from us
    if (rotationAxes[0] == '90deg') {
        // CORRECT?
        result.push(550 - 250 + convertToMLSize(posArr[0])); // x axis
        result.push(550 - convertToMLSize(posArr[1]) - 250); // y axis
        result.push(150 + convertToMLSize(bottom) + 500 * heightRatio / 2); // z axis
    // sideways
    } else if (rotationAxes[2] == '90deg' || rotationAxes[2] == '270deg') {
        result.push(550 - 250 + convertToMLSize(bottom) + 500 * heightRatio / 2); // x axis
        result.push(550 - convertToMLSize(posArr[0]) - 250); // y axis
        result.push(150 + convertToMLSize(posArr[1])); // z axis
    // up down
    } else {
        // CORRECT?
        result.push(550 - 250 + convertToMLSize(posArr[0])); // x axis
        result.push(550 - convertToMLSize(bottom) - 250 - 500 * heightRatio / 2); // y axis
        result.push(150 + convertToMLSize(posArr[1])); // z axis
    }
    result.push(diameterRatio);
    result.push(heightRatio);
    return result;
}

// TODO: CONE c = r / h

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

const port = process.env.PORT || 3000;
// app.listen(port, () => console.log("App running on port " + port))

server.listen(port, function(){
  console.log('listening on ' + port);
});

module.exports = app;
