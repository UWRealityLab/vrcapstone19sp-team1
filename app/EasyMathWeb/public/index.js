// NETWORKING
var socket = io.connect('http://localhost:3000');
socket.on('equations', function (data) {
console.log("update received from server: " + data);

// update the frontend with the new equations
setTextEquations(data);
});

var idEquationMap = {};
var counter = 0;
var numOfShapes = 0;

function $(id) {
    return document.getElementById(id);
}

function getInput(type) {
    var equation = document.createElement("input");
    equation.classList.add(type + counter);
    return equation;
}

function getSpan(value) {
    var span = document.createElement("span");
    span.innerHTML = value;
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
    return button;
}

window.onload = function() {
    $("addSphereEq").onclick = addSphereEq;
    $("addCylinderEq").onclick = addCylinderEq;
}

// --- HELPERS ----
function addSphereEq() {
    counter++;
    numOfShapes++;

    if (numOfShapes >= 4) {
        alert("Sorry, maximum 3 shapes allowed");
        return;
    }

    var container = document.createElement("div");
    // container.id = "" + counter;

    container.appendChild(document.createElement("br"));
    container.appendChild(getSpan(" Equation " + counter + ": "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" x^2 + "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" y^2 + "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" z^2 = "));
    container.appendChild(getInput("sphere-field-"));
    container.appendChild(getSpan(" ^2 "));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("sphere-field-", "Graph Sphere " + counter, updateSphereEq));


    $("sphereEquations").appendChild(container); 
}

function updateSphereEq(id) {
    var sphereEq = getSphereEquations(id);

    if (sphereEq) {
        idEquationMap[id] = sphereEq;

        console.log("sent to server: " + sphereEq);
        socket.emit('sphereEqs', sphereEq);
    }
}

function getSphereEquations(id) {
    var sphereFields = document.getElementsByClassName("sphere-field-" + id);
   
    if (!(sphereFields[0].value == sphereFields[1].value &&
        sphereFields[1].value == sphereFields[2].value && sphereFields[0].value != 0)) {
        alert("X, Y and Z of sphere should be same");
        return null;
    }

    if (sphereFields[3].value == 0) {
        alert("Sphere radius cannot be zero");
        return null;
    }

    // what equations should look like for a sphere
    var sphereEq = {
        id: id,
        type: 'sphere',
        coef: sphereFields[0].value, // 2x^2 + 2y^2 + 2z^2
        position: [0, 0, 0], //(x-a)^2 + (y-b)^2 +2(z-c)^2 -> [a,b,c]
        radius: sphereFields[3].value
    };
    
    return sphereEq;
}

function addCylinderEq() {
    counter++;
    numOfShapes++;

    if (numOfShapes >= 4) {
        alert("Sorry, maximum 3 shapes allowed");
        return;
    }

    var container = document.createElement("div");

    container.appendChild(document.createElement("br"));
    container.appendChild(getSpan(" Equation " + counter + ": "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" "));
    container.appendChild(getDropDown("first-" + counter, "x", "y", "z"));
    container.appendChild(getSpan(" ^2 + "));
    container.appendChild(getInput("cylinder-field-"));
    container.appendChild(getSpan(" "));
    container.appendChild(getDropDown("second-" + counter, "y", "z", "x"));
    container.appendChild(getSpan(" ^2 = "));
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

    $("cylinderEquations").appendChild(container); 
}

function updateCylinderEq(id) {
    var cylinderEq = getCylinderEquations(id);
    
    console.log(cylinderEq);

    if (cylinderEq) {
        idEquationMap[id] = cylinderEq;

        console.log("sent to server: " + cylinderEq);
        socket.emit('cylinderEqs', cylinderEq);
    }
}

function getCylinderEquations(id) {
    var cylinderFields = document.getElementsByClassName("cylinder-field-" + id);
   
    var orientation = checkXYZ(id);
    if (!orientation) {
        alert("X, Y and Z should be selected exactly once");
        return null;
    }

    if (!(cylinderFields[0].value == cylinderFields[1].value && cylinderFields[0].value != 0)) {
        alert("First two values of cylinder should be same");
        return null;
    }

    if (cylinderFields[2].value == 0) {
        alert("Cylinder radius cannot be zero");
        return null;
    }

    if (cylinderFields[3].value >= cylinderFields[4].value) {
        alert("Inequality has to hold");
        return null;
    }

    // what equations for the cylinder should look like
    var cylinderEq = {
        id: id,
        type: 'cylinder',
        coef: cylinderFields[0].value, // 2x^2 + 2y^2
        position: [0, 0], // (x-a)^2+(y-b)^2 [a,b]
        radius: cylinderFields[2].value,
        bottom: cylinderFields[3].value, // lower bound 
        top: cylinderFields[4].value, // higher bound
        height: cylinderFields[4].value - cylinderFields[3].value, //  top - bottom
        rotationAxes: orientation
        // orientation xy, yz, xz
        // if xy || yx -> 90deg, 0, 0
        // if xz -> 0, 0, 0
        // if yz || zy -> 0, 0, 90deg
    };

    return cylinderEq;
}

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

function setTextEquations(newEquations) {
    
}
