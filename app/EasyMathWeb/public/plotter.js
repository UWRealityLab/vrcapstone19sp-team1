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
    equation.style.width = "40px";
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
    dropDown.style.width = "40px";
    dropDown.style.height = "34px";
    dropDown.style.fontSize = "24px";
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
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" )^2 + "));
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

    if (sphereFields[3].value == 0) {
        alert("Sphere radius cannot be zero");
        return null;
    }

    if (sphereFields[3].value > 5) {
        alert("Maximum radius allowed is 5");
        return null;
    }

    // what equations should look like for a sphere
    var sphereEq = {
        id: id,
        type: 'sphere',
        coef: "1",
        position: [sphereFields[0].value, sphereFields[1].value, sphereFields[2].value], //(x-a)^2 + (y-b)^2 +2(z-c)^2 -> [a,b,c]
        radius: sphereFields[3].value
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
    container.appendChild(getSpan(" ("));
    container.appendChild(getDropDown("first-" + counter, "x", "y", "z"));
    container.appendChild(getSpan(" - "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" )^2 + "));
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

    var order = [
        firstFields.options[firstFields.selectedIndex].text,
        secondFields.options[secondFields.selectedIndex].text,
        thirdFields.options[thirdFields.selectedIndex].text
    ];

    if (cylinderFields[2].value == 0) {
        alert("Cylinder radius cannot be zero");
        return null;
    }

    if (cylinderFields[2].value > 5) {
        alert("Maximum radius allowed is 5");
        return null;
    }

    if (cylinderFields[4].value == 0 && cylinderFields[3].value == 0) {
        alert("Inequality m < z < n has to hold");
        return null;
    }

    if (parseInt(cylinderFields[3].value) >= parseInt(cylinderFields[4].value)) {
        alert("Inequality m < z < n has to hold");
        return null;
    }

    if (parseInt(cylinderFields[4].value) - parseInt(cylinderFields[3].value) > 5) {
        alert("Maximum height allowed is 5");
        return null;
    }

    // what equations for the cylinder should look like
    var cylinderEq = {
        id: id,
        type: 'cylinder',
        coef: "1",
        position: [cylinderFields[0].value, cylinderFields[1].value], // (x-a)^2+(y-b)^2 [a,b]
        radius: cylinderFields[2].value,
        bottom: cylinderFields[3].value, // lower bound
        top: cylinderFields[4].value, // higher bound
        height: cylinderFields[4].value - cylinderFields[3].value, //  top - bottom
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
    container.appendChild(getSpan(" ("));
    container.appendChild(getDropDown("first-" + counter, "x", "y", "z"));
    container.appendChild(getSpan(" - "));
    container.appendChild(getInput("cone-field-"));
    container.appendChild(getSpan(" )^2 + "));
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

    var order = [
        firstFields.options[firstFields.selectedIndex].text,
        secondFields.options[secondFields.selectedIndex].text,
        thirdFields.options[thirdFields.selectedIndex].text
    ];

    if (coneFields[2].value == 0) {
        alert("Cone radius cannot be zero");
        return null;
    }

    if (coneFields[2].value > 5) {
        alert("Maximum radius allowed is 5");
        return null;
    }

    if (coneFields[3].value == 0) {
        alert("C cannot be zero");
        return null;
    }

    if (parseInt(coneFields[4].value) >= parseInt(coneFields[5].value)) {
        alert("Inequality m < z < n has to hold");
        return null;
    }

    if (coneFields[4].value == 0 && coneFields[5].value == 0) {
        alert("Inequality m < z < n has to hold");
        return null;
    }

    var h1 = parseInt(coneFields[5].value) - parseInt(coneFields[4].value);
    var h2 = parseFloat(coneFields[2].value) / parseFloat(coneFields[3].value);

    if (h1 != h2) {
        alert("m - n height should be same as r / c height");
        return null;
    }

    if (h1 > 5) {
        alert("Maximum height allowed is 5");
        return null;
    }

    // what equations for the cylinder should look like
    var coneEq = {
        id: id,
        type: 'cone',
        coef: "1",
        position: [coneFields[0].value, coneFields[1].value],
        radius: coneFields[2].value,
        bottom: coneFields[4].value, // lower bound
        top: coneFields[5].value, // higher bound
        height: coneFields[5].value - coneFields[4].value, //  top - bottom
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
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" ^ 2 + "));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" ^ 2 + "));
    container.appendChild(getSpan(" (z - "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field-"));
    container.appendChild(getSpan(" ^ 2 = 1"));
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

    if (ellipsoidFields[1].value == 0 ||
        ellipsoidFields[3].value == 0 ||
        ellipsoidFields[5].value == 0) {
        alert("Denominators of X, Y and Z cannot be zero");
        return null;
    }

    if (ellipsoidFields[1].value > 5 ||
        ellipsoidFields[3].value > 5 ||
        ellipsoidFields[5].value > 5) {
        alert("Maximum radius allowed is 5");
        return null;
    }


    // what equations should look like for a sphere
    var ellipsoidEq = {
        id: id,
        type: 'ellipsoid',
        coef: "1",
        position: [ellipsoidFields[0].value, ellipsoidFields[2].value, ellipsoidFields[4].value],
        radius: 1,
        denoms: [ellipsoidFields[1].value, ellipsoidFields[3].value, ellipsoidFields[5].value],
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

        sphereFields[0].value = data.position[0];
        sphereFields[1].value = data.position[1];
        sphereFields[2].value = data.position[2];

        sphereFields[3].value = data.radius;
    } else if (data.type == 'cylinder') {
        var cylinderFields = document.getElementsByClassName("cylinder-field-" + data.id);

        cylinderFields[0].value = data.position[0];
        cylinderFields[1].value = data.position[1];

        cylinderFields[2].value = data.radius;

        cylinderFields[3].value = data.bottom;
        cylinderFields[4].value = data.top;

        // Test this
        $("first-" + data.id).value = data.order[0];
        $("second-" + data.id).value = data.order[1];
        $("third-" + data.id).value = data.order[2];
    } else if (data.type == 'cone') {
        var coneFields = document.getElementsByClassName("cone-field-" + data.id);

        coneFields[0].value = data.position[0];
        coneFields[1].value = data.position[1];

        coneFields[2].value = data.radius;

        coneFields[3].value = parseInt(data.radius) / (parseInt(data.top) - parseInt(data.bottom));

        coneFields[4].value = data.bottom;
        coneFields[5].value = data.top;

        // Test this
        $("first-" + data.id).value = data.order[0];
        $("second-" + data.id).value = data.order[1];
        $("third-" + data.id).value = data.order[2];
    } else if (data.type == 'ellipsoid') {
        var ellipsoidFields = document.getElementsByClassName("ellipsoid-field-" + data.id);

        ellipsoidFields[0].value = data.position[0];
        ellipsoidFields[2].value = data.position[1];
        ellipsoidFields[4].value = data.position[2];

        ellipsoidFields[1].value = data.denoms[0];
        ellipsoidFields[3].value = data.denoms[1];
        ellipsoidFields[5].value = data.denoms[2];
    }
}
