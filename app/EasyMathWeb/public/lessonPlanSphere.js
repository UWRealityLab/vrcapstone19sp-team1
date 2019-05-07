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
    equation.style.width = "30px";
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
    return body;
}

function playGroundEquation() {
    var container = document.createElement('div');

    container.appendChild(getSpan(" Equation :"));
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("sphere-field"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("sphere-field"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getSpan(" (z - "));
    container.appendChild(getInput("sphere-field"));
    container.appendChild(getSpan(" )^2 = "));
    container.appendChild(getInput("sphere-field"));
    container.appendChild(getSpan(" ^2 "));
    
    return container;
}

function getSpan(value) {
    var span = document.createElement("span");
    span.innerHTML = value;
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

function updateSphereEq() {
    if (currStepNum == 2) {
        var values = C("step2Radius");

        if (values[0].value == 0) {
            alert("radius cannot be zero");
            return;
        }

        var sphereEq = {
            id: 2,
            type: 'sphere',
            coef: 1,
            position: [0, 0, 0],
            radius: Math.sqrt(values[0].value),
            text: "Sphere Tutorial: Step 2",
        };

        console.log("sent to server: " + sphereEq);
        socket.emit('sphereEqs', sphereEq);

        console.log(sphereEq);

        if (values[0].value == 6) {
            alert("You got it right");
        }
    } else if (currStepNum == 3) {
        var values = C("sphere-field");

        if (values[3] == 0) {
            alert("radius cannot be zero");
            return;
        }

        var sphereEq = {
            id: 3,
            type: 'sphere',
            coef: 1,
            position: [values[0].value, values[1].value, values[2].value],
            radius: values[3].value,
            text: "Sphere Tutorial: Step 3",
        };

        console.log("sent to server: " + sphereEq);
        socket.emit('sphereEqs', sphereEq);

        console.log(sphereEq);

        if (values[0].value == 1 && values[1].value == 3 && values[2].value == 1 && values[3].value == 3) {
            alert("You got it right");
        }
    } else if (currStepNum == 5) {
        var values = C("sphere-field");

        if (values[3] == 0) {
            alert("radius cannot be zero");
            return;
        }

        var sphereEq = {
            id: 5,
            type: 'sphere',
            coef: 1,
            position: [values[0].value, values[1].value, values[2].value],
            radius: values[3].value,
            text: "Sphere Tutorial: Step 5",
        };

        console.log("sent to server: " + sphereEq);
        socket.emit('sphereEqs', sphereEq);

        console.log(sphereEq);
    }
}

function startStep4() {
    var sphereEq = {
        id: 4,
        type: 'sphere',
        coef: 1,
        position: [0, 0, 0],
        radius: 1,
        text: "Sphere Tutorial: Step 4",
    };

    console.log("sent to server: " + sphereEq);
    socket.emit('sphereEqs', sphereEq);

    console.log(sphereEq);
}

function updateEquation(data) {
    if (data.type == 'sphere' && data.id == 4) {
        var sphereFields = document.getElementsByClassName("sphere-field");

        sphereFields[0].value = data.position[0];
        sphereFields[1].value = data.position[1];
        sphereFields[2].value = data.position[2];

        sphereFields[3].value = data.radius;

        if (sphereFields[0].value == 2 && sphereFields[1].value == 1 && sphereFields[2].value == 3 && sphereFields[2].value == 2) {
            alert("You got it right");
        }
    }
}

function getStep1() {
    var container = document.createElement("div");
    container.id = "1";
    container.appendChild(getStepTitle("Step 1: Sphere Introduction:"));
    container.appendChild(getBody("A sphere is a 3D representation of the circle. The equation of the sphere is similar to that of the circle, but with an extra variable z for the extra dimension. So, this is an equation for a sphere -"));
    container.appendChild(getDisplayEq("(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2"));
    container.appendChild(getBody("Sphere equation contains two parts :"));
    container.appendChild(getList(["The coordinate (a, b, c) tells us where the center of the sphere is. So, if a = b = c = 0, the sphere is centered on the origin.", "In equation, r represents the radius of the sphere. Note that the radius is squared."]));
    return container;
}

function getStep2() {
    var container = document.createElement("div");
    
    container.id = "2";
    container.appendChild(getStepTitle("Step 2: Understand Radius:"));
    container.appendChild(getBody("Radius determines the size of the sphere. If we know the center of the sphere and one of the point it passes through, we can solve the sphere equation to find the radius of the sphere."));
    container.appendChild(getSubTitle("Exercise: "));
    container.appendChild(getBody("Consider a sphere which is centered at (0, 0, 0) and passes through the point (1, 2 , 1). Enter complete the sphere equation below and check on the magic leap to see your sphere."));
    container.appendChild(getSpan("(x - 0)^2 + (y - 0)^2 + (z - 0)^2 = "));
    container.appendChild(getInput("step2Radius"));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Check Sphere", updateSphereEq));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep3() {
    var container = document.createElement("div");

    container.id = "3";
    container.appendChild(getStepTitle("Step 3: Understand the Position"));
    container.appendChild(getBody("The coordinate (a , b, c) tells us where the center of the sphere is. So, if the sphere is centered on the origin, a = b = c = 0."));
    container.appendChild(getSubTitle("Exercise: "));
    container.appendChild(getBody("Complete the equation of the sphere below so that it is centered on coordinate (1, 3, 1) and has radius 3."));
    container.appendChild(playGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Check Sphere", updateSphereEq));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep4() {
    var container = document.createElement("div");

    container.id = "4";
    container.appendChild(getStepTitle("Step 4: Final Test"));
    container.appendChild(getBody("Check your magic leap, you will see a sphere with radius 1 and centered at the origin. Interact with the sphere and change it until it matches the following equation - "));
    container.appendChild(getSpan("(x - 2)^2 + (y - 1)^2 + (z - 3)^2 = 4"));
    container.appendChild(getBody("As you change the sphere, you can see the updated values on this equation below - "));
    container.appendChild(playGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Start Step 4", startStep4));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep5() {
    var container = document.createElement("div");

    container.id = "5";
    container.appendChild(getStepTitle("Step 5: Playground"));
    container.appendChild(getBody("Now that you understand all the parts of the sphere,  here is a template of a sphere equation. Just play around with the values and check on the magic leap how is it getting plotted."));
    container.appendChild(playGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Graph Sphere", updateSphereEq));
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

    if (currStepNum == 5) {
        $("next").disabled = true;
    }

    if (currStepNum > 1) {
        $("prev").disabled = false;
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
    }

    if (currStepNum < 5) {
        $("next").disabled = false;
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
    steps = {"1": getStep1(), "2": getStep2(), "3": getStep3(), "4": getStep4(), "5": getStep5()};
    $("stepContainer").appendChild(steps["1"]);
    $("next").onclick = nextStep;
    $("prev").onclick = prevStep;
    $("prev").disabled = true;

    socket.emit('deleteAllEqs', "");
}