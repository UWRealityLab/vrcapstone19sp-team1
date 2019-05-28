// NETWORKING
var socket = io.connect('http://localhost:3000');
socket.on('equations', function (data) {
    console.log("update received from server: " + data);

    // update the frontend with the new equations
    updateEquation(data);
});

function getList(bullets) {
    var list = document.createElement("ul");
    for (var i = 0; i < bullets.length; i++) {
        var sub = document.createElement("li");
        sub.innerHTML = bullets[i];
        list.appendChild(sub);
    }
    return list;    
}

function getInput(id) {
    var equation = document.createElement("input");
    equation.style.width = "40px";
    equation.style.height = "34px";
    equation.style.fontSize = "24px";
    equation.classList.add(id);
    return equation;
}

function getStepTitle(title) {
    var tit = document.createElement("h3");
    tit.innerHTML = title;
    return tit;
}

function getSubTitle(title) {
    var tit = document.createElement("h4");
    tit.innerHTML = title;
    return tit;
}

function getBody(bo) {
    var body = document.createElement("p");
    body.innerHTML = bo;
    return body;
}

function getDisplayEq(eq) {
    var body = document.createElement("p");
    body.innerHTML = eq;
    body.classList.add("eqClass");
    return body;
}

function getSpan(value) {
    var span = document.createElement("span");
    span.innerHTML = value;
    span.classList.add("eqClass");
    return span;
}

function getButton(name, handler) {
    var button = document.createElement("button");

    button.innerHTML = name;

    button.addEventListener('click', function() {
        handler();
    })

    return button;
}

function conePlayGroundEquationStep3() {
    var container = document.createElement('div');

    container.appendChild(getSpan(" Equation :"));
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" )^2 = "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" ^2 / "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" ^2"));
    
    return container;
}

function conePlayGroundEquation() {
    var container = document.createElement('div');

    container.appendChild(getSpan(" Equation :"));
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" )^2 = "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" ^2 / "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" ^2 where "));
    container.appendChild(getInput("cone-field"));
    container.appendChild(getSpan(" < z < "));
    container.appendChild(getInput("cone-field"));
    
    return container;
}

function updateConeEq() {
    if (currStepNum == 2) {
        var values = C("step2C");

        if (values[0].value == 0) {
            alert("cannot divide by zero");
            return;
        }

        var coneEq = {
            id: 2,
            type: 'cone',
            coef: "1",
            position: ["0", "0"],
            radius: "2",
            bottom: "1", // lower bound
            top: "5", // higher bound
            height: 2 / parseFloat(values[0].value), //  top - bottom
            rotationAxes: ['90deg', '0', '0'],
            order: ["x", "y", "z"]
        };

        console.log("sent to server: " + coneEq);
        socket.emit('coneEqs', coneEq);

        console.log(coneEq);

        if (values[0].value == 0.5) {
            alert("You got it right");
        }
    } else if (currStepNum == 4) {
        var values = C("cone-field");

        if (values[2] == 0) {
            alert("radius cannot be zero");
            return;
        }

        if (values[3].value == 0) {
            alert("cannot divide by zero");
            return;
        }

        if (parseInt(values[4].value) >= parseInt(values[5].value)) {
            alert("Inequality m < z < n has to hold");
        }

        var h1 = parseInt(values[5].value) - parseInt(values[4].value);
        var h2 = parseFloat(values[2].value) / parseFloat(values[3].value);

        if (h1 != h2) {
            alert("m - n height should be same as r / c height");
            return null;
        }

        var coneEq = {
            id: 4,
            type: 'cone',
            coef: "1",
            position: [values[0].value, values[1].value],
            radius: values[2].value,
            bottom: values[4].value, // lower bound
            top: values[5].value, // higher bound
            height: values[5].value - values[4].value, //  top - bottom
            rotationAxes: ['90deg', '0', '0'],
            order: ["x", "y", "z"]
        };

        console.log("sent to server: " + coneEq);
        socket.emit('sphereEqs', coneEq);

        console.log(coneEq);
    }
}

function startStep3() {
    var coneEq = {
        id: 3,
        type: 'cone',
        coef: "1",
        position: ["0", "0"],
        radius: "1",
        bottom: "1", // lower bound
        top: "2", // higher bound
        height: 1, //  top - bottom
        rotationAxes: ['90deg', '0', '0'],
        order: ["x", "y", "z"],
    };

    console.log("sent to server: " + coneEq);
    socket.emit('sphereEqs', coneEq);

    console.log(coneEq);

    var coneFields = document.getElementsByClassName("cone-field");

    coneFields[0].value = 0;
    coneFields[1].value = 0;
    coneFields[2].value = 1;

    coneFields[3].value = 1;
}

function updateEquation(data) {
    if (data.type == 'cone') {
        var coneFields = document.getElementsByClassName("cone-field");

        coneFields[0].value = data.position[0];
        coneFields[1].value = data.position[1];
        coneFields[2].value = data.radius;

        coneFields[3].value = parseInt(data.radius) / parseInt(data.height);

        if (data.id == 3) {
            if (data.position[0] == 2 && data.position[1] == 1 && data.radius == 2 && data.height == 4) {
                alert("You got it right");
            }
        }
    }
}

// --------------------------------------------
// ------------- Cone Steps -----------------
// --------------------------------------------

function getStep1() {
    var container = document.createElement("div");

    container.id = "1";
    container.appendChild(getStepTitle("Step 1: Cone Introduction:"));
    container.appendChild(getBody("A cone is a 3D shape that has circular base, a point on the other end and a curved side."));
    container.appendChild(getDisplayEq("(x - a)^2 + (y - b)^2 = r^2 / c^2 where m < z < n"));
    container.appendChild(getBody("Cone equation contains three parts :"));
    container.appendChild(getList(["The coordinates (a, b) tells us where the center of the circular base is. So, if a = b = 0, the cone's base is centered on the origin.",
                                   "In equation, r represents the radius of the cone. Note that the radius is squared.",
                                   "r / c is the height of the cone which can also be represented by (n - m)"]));
    return container;
}

function getStep2() {
    var container = document.createElement("div");
    
    container.id = "2";
    container.appendChild(getStepTitle("Step 2: Understand Height:"));
    container.appendChild(getBody("Height determines how long the cone is i.e. how far the pointed end is from the circular base."));
    container.appendChild(getSubTitle("Exercise: "));
    container.appendChild(getBody("Consider a cone which is centered at (0, 0) with radius 2 and height 4. Complete the cone equation below and check on the magic leap to see your cone."));
    container.appendChild(getSpan("(x - 0)^2 + (y - 0)^2 = 4 / "));
    container.appendChild(getInput("step2C"));
    container.appendChild(getSpan("^2"));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Check Cone", updateConeEq));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep3() {
    var container = document.createElement("div");

    container.id = "3";
    container.appendChild(getStepTitle("Step 3: Final Test"));
    container.appendChild(getBody("Check your magic leap, you will see a cone with radius 1, height 1 and centered at the origin. Interact with the cone and change it until it matches the following equation - "));
    container.appendChild(getSpan("(x - 2)^2 + (y - 1)^2 = 2^2 / 0.5^2"));
    container.appendChild(getBody("As you change the cone, you can see the updated values on this equation below - "));
    container.appendChild(conePlayGroundEquationStep3());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Start Step 4", startStep3));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep4() {
    var container = document.createElement("div");

    container.id = "4";
    container.appendChild(getStepTitle("Step 4: Playground"));
    container.appendChild(getBody("Now that you understand all the parts of the cone,  here is a template of a cone equation. Just play around with the values and check on the magic leap how is it getting plotted."));
    container.appendChild(conePlayGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Graph Cone", updateConeEq));
    container.appendChild(document.createElement("br"));

    return container;
}

function nextStep() {
    while ($("stepContainer").firstChild) {
        $("stepContainer").removeChild($("stepContainer").firstChild);
    }

    deleteEq(currStepNum);
    currStepNum++;

    $("stepContainer").appendChild(steps["" + currStepNum]);

    if (currStepNum == 4) {
        $("next").disabled = true;
        $("next").classList.add("disable");
    }

    if (currStepNum > 1) {
        $("prev").disabled = false;
        $("prev").classList.remove("disable");
    }
}

function deleteEq(id) {
    console.log("sent to server: " + id + " for delete");
    socket.emit('deleteEqs', id);
}

function prevStep() {
    while ($("stepContainer").firstChild) {
        $("stepContainer").removeChild($("stepContainer").firstChild);
    }

    deleteEq(currStepNum);
    currStepNum--;
    
    $("stepContainer").appendChild(steps["" + currStepNum]);

    if (currStepNum == 1) {
        $("prev").disabled = true;
        $("prev").classList.add("disable");
    }

    if (currStepNum < 4) {
        $("next").disabled = false;
        $("next").classList.remove("disable");
    }
}

var steps = {};
var currStepNum = 1;

function $(id) {
    return document.getElementById(id);
}

function C(id) {
    return document.getElementsByClassName(id);
}

window.onload = function() {
    steps = {"1": getStep1(), "2": getStep2(), "3": getStep3(), "4": getStep4()};

    $("stepContainer").appendChild(steps["1"]);
    $("next").onclick = nextStep;
    $("prev").onclick = prevStep;
    $("prev").disabled = true;
    $("prev").classList.add("disable");

    socket.emit('deleteAllEqs', "");
}