// NETWORKING
var socket = io.connect('http://localhost:3000');
socket.on('equations', function (data) {
    console.log("update received from server: " + JSON.stringify(data));

    // update the frontend with the new equations
    updateEquation(data);
});

// --- Global Fields ---
var idEquationMap = {};
var counter = 0;
var numOfShapes = 0;

// --- HELPERS ----
function $(id) {
    return document.getElementById(id);
}

function getInput(type) {
    var equation = document.createElement("input");
    equation.style.width = "30px";
    equation.style.height = "34px";
    equation.style.fontSize = "24px";
    equation.classList.add(type + counter);
    return equation;
}

function getSpan(value) {
    var span = document.createElement("span");
    span.innerHTML = value;
    span.classList.add("eqClass");
    return span;
}

function getOption(value) {
    var option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    return option;
}

function getDropDown(id, first, second, third) {
    var dropDown = document.createElement("select");
    dropDown.appendChild(getOption(first));
    dropDown.appendChild(getOption(second));
    dropDown.appendChild(getOption(third));
    dropDown.id = id;
    return dropDown;
}

function getButton(name, value, handler) {
    var button = document.createElement("button");
    button.id = name + counter;
    button.value = counter;
    button.innerHTML = value;
    button.addEventListener('click', function() {
        handler(button.value);
    })
    button.classList.add("buttons");
    return button;
}

window.onload = function() {
    $("addSphereEq").onclick = addSphereEq;
    $("addCylinderEq").onclick = addCylinderEq;
    $("addConeEq").onclick = addConeEq;
    $("addEllipsoidEq").onclick = addEllipsoidEq;
    socket.emit('deleteAllEqs', "");
}

function deleteEq(id) {
    var div = $("div-" + id);
    div.parentNode.removeChild(div);

    numOfShapes--;

    console.log("sent to server: " + id + " for delete");
    socket.emit('deleteEqs', id);
}


// -----------------------------------------------------------
// ------------------- Sphere Methods ------------------------
// -----------------------------------------------------------
function addSphereEq() {
    if (numOfShapes > 2) {
        alert("Sorry, maximum 3 shapes allowed");
        return;
    }

    counter++;
    numOfShapes++;

    var container = document.createElement("div");
    container.id = "div-" + counter;

    container.appendChild(document.createElement("br"));
    container.appendChild(getSpan(" Equation " + counter + ": "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" (z - "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" )^2 = "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" ^2 "));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("sphere-field-", "Graph Sphere " + counter, updateSphereEq));
    container.appendChild(getSpan(" "));
    container.appendChild(getButton("sphere-field-", "Delete Sphere " + counter, deleteEq));

    $("sphereEquations").appendChild(container);
}

function updateSphereEq(id) {
    var sphereEq = getSphereEquations(id);

    if (sphereEq) {
        idEquationMap[id] = sphereEq;

        console.log("sent to server: " + sphereEq);
        socket.emit('sphereEqs', sphereEq);

        console.log(sphereEq);
    }
}

function getSphereEquations(id) {
    var sphereFields = document.getElementsByClassName("sphere-field-" + id);

    if (!(sphereFields[0].value == sphereFields[2].value &&
        sphereFields[2].value == sphereFields[4].value && sphereFields[0].value != 0)) {
        alert("Coefficients of X, Y and Z of sphere should be same");
        return null;
    }

    if (sphereFields[6].value == 0) {
        alert("Sphere radius cannot be zero");
        return null;
    }

    // what equations should look like for a sphere
    var sphereEq = {
        id: id,
        type: 'sphere',
        coef: sphereFields[0].value, // 2x^2 + 2y^2 + 2z^2
        position: [sphereFields[1].value, sphereFields[3].value, sphereFields[5].value], //(x-a)^2 + (y-b)^2 +2(z-c)^2 -> [a,b,c]
        radius: sphereFields[6].value
    };

    return sphereEq;
}

// -----------------------------------------------------------
// ------------------ Cylinder Methods -----------------------
// -----------------------------------------------------------

function addCylinderEq() {
    if (numOfShapes > 2) {
        alert("Sorry, maximum 3 shapes allowed");
        return;
    }

    counter++;
    numOfShapes++;

    var container = document.createElement("div");
    container.id = "div-" + counter;

    container.appendChild(document.createElement("br"));
    container.appendChild(getSpan(" Equation " + counter + ": "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" ("));
    container.appendChild(getDropDown("first-" + counter, "x", "y", "z"));
    container.appendChild(getSpan(" - "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" ("));
    container.appendChild(getDropDown("second-" + counter, "y", "z", "x"));
    container.appendChild(getSpan(" - "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" )^2 = "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" ^2 where "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" < "));
    container.appendChild(getDropDown("third-" + counter, "z", "x", "y"));
    container.appendChild(getSpan(" < "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("cylinder-field-", "Graph Cylinder " + counter, updateCylinderEq));
    container.appendChild(getSpan(" "));
    container.appendChild(getButton("cylinder-field-", "Delete Cylinder " + counter, deleteEq));

    $("cylinderEquations").appendChild(container);
}

function updateCylinderEq(id) {
    var cylinderEq = getCylinderEquations(id);

    if (cylinderEq) {
        idEquationMap[id] = cylinderEq;

        console.log("sent to server: " + cylinderEq);
        socket.emit('cylinderEqs', cylinderEq);

        console.log(cylinderEq);
    }
}

function getCylinderEquations(id) {
    var cylinderFields = document.getElementsByClassName("cylinder-field-" + id);

    var orientation = checkXYZ(id);
    if (!orientation) {
        alert("X, Y and Z should be selected exactly once");
        return null;
    }

    var firstFields = $("first-" + id);
    var secondFields = $("second-" + id);
    var thirdFields = $("third-" + id);

    if (!(cylinderFields[0].value == cylinderFields[2].value && cylinderFields[0].value != 0)) {
        alert("Coefficients of " + firstFields.options[firstFields.selectedIndex].text +  " and " + secondFields.options[secondFields.selectedIndex].text + " should be same");
        return null;
    }

    var order = [
        firstFields.options[firstFields.selectedIndex].text,
        secondFields.options[secondFields.selectedIndex].text,
        thirdFields.options[thirdFields.selectedIndex].text
    ];

    if (cylinderFields[4].value == 0) {
        alert("Cylinder radius cannot be zero");
        return null;
    }

    if (parseInt(cylinderFields[5].value) >= parseInt(cylinderFields[6].value)) {
        alert("Inequality has to hold");
        return null;
    }
    // what equations for the cylinder should look like
    var cylinderEq = {
        id: id,
        type: 'cylinder',
        coef: cylinderFields[0].value, // 2x^2 + 2y^2
        position: [cylinderFields[1].value, cylinderFields[3].value], // (x-a)^2+(y-b)^2 [a,b]
        radius: cylinderFields[4].value,
        bottom: cylinderFields[5].value, // lower bound
        top: cylinderFields[6].value, // higher bound
        height: cylinderFields[6].value - cylinderFields[5].value, //  top - bottom
        rotationAxes: orientation,
        order: order
        // orientation xy, yz, xz
        // if xy || yx -> 90deg, 0, 0
        // if xz -> 0, 0, 0
        // if yz || zy -> 0, 0, 90deg
    };

    return cylinderEq;
}

// -----------------------------------------------------------
// -------------------- Cone Methods -------------------------
// -----------------------------------------------------------

function addConeEq() {
    if (numOfShapes > 2) {
        alert("Sorry, maximum 3 shapes allowed");
        return;
    }

    counter++;
    numOfShapes++;

    var container = document.createElement("div");
    container.id = "div-" + counter;

    container.appendChild(document.createElement("br"));
    container.appendChild(getSpan(" Equation " + counter + ": "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(getSpan(" ("));
    container.appendChild(getDropDown("first-" + counter, "x", "y", "z"));
    container.appendChild(getSpan(" - "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(getSpan(" ("));
    container.appendChild(getDropDown("second-" + counter, "y", "z", "x"));
    container.appendChild(getSpan(" - "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(getSpan(" )^2 = "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(getSpan(" ^ 2 / "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(getSpan(" ^ 2 where "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(getSpan(" < "));
    container.appendChild(getDropDown("third-" + counter, "z", "x", "y"));
    container.appendChild(getSpan(" < "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("cone-field-", "Graph Cone " + counter, updateConeEq));
    container.appendChild(getSpan(" "));
    container.appendChild(getButton("cone-field-", "Delete Cone " + counter, deleteEq));

    $("coneEquations").appendChild(container);
}

function updateConeEq(id) {
    var coneEq = getConeEquations(id);

    if (coneEq) {
        idEquationMap[id] = coneEq;

        console.log("sent to server: " + coneEq);
        socket.emit('coneEqs', coneEq);

        console.log(coneEq);
    }
}

// PLEASE CHECK HEIGHT
function getConeEquations(id) {
    var coneFields = document.getElementsByClassName("cone-field-" + id);

    var orientation = checkXYZ(id);
    if (!orientation) {
        alert("X, Y and Z should be selected exactly once");
        return null;
    }

    var firstFields = $("first-" + id);
    var secondFields = $("second-" + id);
    var thirdFields = $("third-" + id);

    if (!(coneFields[0].value == coneFields[2].value && coneFields[0].value != 0)) {
        alert("Coefficients of " + firstFields.options[firstFields.selectedIndex].text +  " and " + secondFields.options[secondFields.selectedIndex].text + " should be same");
        return null;
    }

    var order = [
        firstFields.options[firstFields.selectedIndex].text,
        secondFields.options[secondFields.selectedIndex].text,
        thirdFields.options[thirdFields.selectedIndex].text
    ];

    if (coneFields[4].value == 0) {
        alert("Cone radius cannot be zero");
        return null;
    }

    if (coneFields[5].value == 0) {
        alert("C cannot be zero");
        return null;
    }

    if (parseInt(coneFields[6].value) >= parseInt(coneFields[7].value)) {
        alert("Inequality has to hold");
        return null;
    }

    var r = parseInt(coneFields[7].value) - parseInt(coneFields[6].value);

    // what equations for the cylinder should look like
    var coneEq = {
        id: id,
        type: 'cone',
        coef: coneFields[0].value,
        position: [coneFields[1].value, coneFields[3].value],
        radius: coneFields[4].value,
        bottom: coneFields[6].value, // lower bound
        top: coneFields[7].value, // higher bound
        height: coneFields[7].value - coneFields[6].value, //  top - bottom
        rotationAxes: orientation,
        order: order
        // orientation xy, yz, xz
        // if xy || yx -> 90deg, 0, 0
        // if xz -> 0, 0, 0
        // if yz || zy -> 0, 0, 90deg
    };

    return coneEq;
}

// -----------------------------------------------------------
// ------------------ Ellipsoid Methods ----------------------
// -----------------------------------------------------------
function addEllipsoidEq() {
    if (numOfShapes > 2) {
        alert("Sorry, maximum 3 shapes allowed");
        return;
    }

    counter++;
    numOfShapes++;

    var container = document.createElement("div");
    container.id = "div-" + counter;

    container.appendChild(document.createElement("br"));
    container.appendChild(getSpan(" Equation " + counter + ": "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" ^ 2 + "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" ^ 2 + "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" (z - "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" ^ 2 = "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" ^2 "));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("ellipsoid-field-", "Graph Ellipsoid " + counter, updateEllipsoidEq));
    container.appendChild(getSpan(" "));
    container.appendChild(getButton("ellipsoid-field-", "Delete Ellipsoid " + counter, deleteEq));

    $("ellipsoidEquations").appendChild(container);
}

function updateEllipsoidEq(id) {
    var ellipsoidEq = getEllipsoidEquations(id);

    if (ellipsoidEq) {
        idEquationMap[id] = ellipsoidEq;

        console.log("sent to server: " + ellipsoidEq);
        socket.emit('ellipsoidEqs', ellipsoidEq);

        console.log(ellipsoidEq);
    }
}

function getEllipsoidEquations(id) {
    var ellipsoidFields = document.getElementsByClassName("ellipsoid-field-" + id);

    if (!(ellipsoidFields[0].value == ellipsoidFields[3].value &&
        ellipsoidFields[3].value == ellipsoidFields[6].value &&
        ellipsoidFields[0].value != 0)) {
        alert("Coefficients of X, Y and Z of ellipsoid should be same");
        return null;
    }

    if (ellipsoidFields[9].value == 0) {
        alert("Ellipsoid radius cannot be zero");
        return null;
    }

    if (ellipsoidFields[2].value == 0 ||
        ellipsoidFields[5].value == 0 ||
        ellipsoidFields[8].value == 0) {
        alert("Denominators of X, Y and Z cannot be zero");
        return null;
    }

    // what equations should look like for a sphere
    var ellipsoidEq = {
        id: id,
        type: 'ellipsoid',
        coef: ellipsoidFields[0].value,
        position: [ellipsoidFields[1].value, ellipsoidFields[4].value, ellipsoidFields[7].value],
        radius: ellipsoidFields[9].value,
        denoms: [ellipsoidFields[2].value, ellipsoidFields[5].value, ellipsoidFields[8].value],
    };

    return ellipsoidEq;
}

// --- Parameter Checking Helper method
function checkXYZ(id) {
    var actual = [];

    var firstFields = $("first-" + id);
    actual.push(firstFields.options[firstFields.selectedIndex].text);

    var secondFields = $("second-" + id);
    actual.push(secondFields.options[secondFields.selectedIndex].text);

    var thirdFields = $("third-" + id);
    actual.push(thirdFields.options[thirdFields.selectedIndex].text);

    if (!actual.includes("x") || !actual.includes("y") || !actual.includes("z")) {
        return null;
    } else {
        if ((actual[0] == "x" && actual[1] == "y") || (actual[0] == "y" && actual[1] == "x")) {
            return ['90deg', '0', '0'];
        } else if ((actual[0] == "y" && actual[1] == "z") || (actual[0] == "z" && actual[1] == "y")) {
            return ['0', '0', '90deg'];
        } else {
            return ['0', '0', '0'];
        }
    }
}

// Update Equations using server update
function updateEquation(data) {
    if (data.type == 'sphere') {
        var sphereFields = document.getElementsByClassName("sphere-field-" + data.id);

        sphereFields[0].value = data.coef;
        sphereFields[2].value = data.coef;
        sphereFields[4].value = data.coef;

        sphereFields[1].value = data.position[0];
        sphereFields[3].value = data.position[1];
        sphereFields[5].value = data.position[2];

        sphereFields[6].value = data.radius;
    } else if (data.type == 'cylinder') {
        var cylinderFields = document.getElementsByClassName("cylinder-field-" + data.id);

        cylinderFields[0].value = data.coef;
        cylinderFields[2].value = data.coef;

        // Can be
        // XY, YX
        // XZ, ZX
        // YZ, ZY
        
        cylinderFields[1].value = data.position[0];
        cylinderFields[3].value = data.position[1];

        cylinderFields[4].value = data.radius;

        cylinderFields[5].value = data.bottom;
        cylinderFields[6].value = data.top;
    } else if (data.type == 'cone') {
        var coneFields = document.getElementsByClassName("cone-field-" + data.id);

        coneFields[0].value = data.coef;
        coneFields[2].value = data.coef;

        coneFields[1].value = data.position[0];
        coneFields[3].value = data.position[1];

        coneFields[4].value = data.radius;

        coneFields[5].value = parseInt(data.radius) / (parseInt(data.top) - parseInt(data.bottom));

        coneFields[6].value = data.bottom;
        coneFields[7].value = data.top;
    } else if (data.type == 'ellipsoid') {
        var ellipsoidFields = document.getElementsByClassName("ellipsoid-field-" + data.id);

        ellipsoidFields[0].value = data.coef;
        ellipsoidFields[3].value = data.coef;
        ellipsoidFields[6].value = data.coef;

        ellipsoidFields[1].value = data.position[0];
        ellipsoidFields[4].value = data.position[1];
        ellipsoidFields[7].value = data.position[2];

        ellipsoidFields[2].value = data.denoms[0];
        ellipsoidFields[5].value = data.denoms[1];
        ellipsoidFields[8].value = data.denoms[2];

        ellipsoidFields[9].value = data.radius;
    }
}
