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

function spherePlayGroundEquation() {
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

function cylinderPlayGroundEquation() {
    var container = document.createElement('div');

    container.appendChild(getSpan(" Equation :"));
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("cylinder-field"));
    container.appendChild(getSpan(" )^2 + "));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("cylinder-field"));
    container.appendChild(getSpan(" )^2 = "));
    container.appendChild(getInput("cylinder-field"));
    container.appendChild(getSpan(" ^2 where "));
    container.appendChild(getInput("cylinder-field"));
    container.appendChild(getSpan(" < z < "));
    container.appendChild(getInput("cylinder-field"));
    
    return container;
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

        if (values[3].value == 0) {
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

        if (values[3].value == 0) {
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

function updateCylinderEq() {
    if (currStepNum == 7) {
        var radius = C("step7Radius");

        var range = C("step7Range");

        if (radius[0].value == 0) {
            alert("radius cannot be zero");
            return;
        }

        if (parseInt(range[0]).value >= 3) {
            alert("Inequality m < z < n should hold");
            return;
        }

        var cylinderEq = {
            id: 7,
            type: 'cylinder',
            coef: 1,
            position: [0, 0],
            radius: radius[0].value,
            bottom: range[0].value,
            top: 3,
            height: 3 - range[0].value,
            rotationAxes: ['90deg', '0', '0'],
            text: "Cylinder Tutorial: Step 7",
        };

        console.log("sent to server: " + cylinderEq);
        socket.emit('cylinderEqs', cylinderEq);

        console.log(cylinderEq);

        if (radius[0].value == 2 && range[0].value == 1) {
            alert("You got it right");
        }
    } else if (currStepNum == 9) {
        var values = C("cylinder-field");

        if (values[2].value == 0) {
            alert("radius cannot be zero");
            return;
        }

        if (parseInt(values[3].value) >= parseInt(values[4].value)) {
            alert("Inequality m < z < n should hold");
            return;
        }

        var cylinderEq = {
            id: 9,
            type: 'cylinder',
            coef: 1,
            position: [values[0].value, values[1].value],
            radius: values[2].value,
            bottom: values[3].value,
            top: values[4].value,
            height: values[4].value - values[3].value,
            rotationAxes: ['90deg', '0', '0'],
            text: "Cylinder Tutorial: Step 9",
        };

        console.log("sent to server: " + cylinderEq);
        socket.emit('sphereEqs', cylinderEq);

        console.log(cylinderEq);
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

    var sphereFields = document.getElementsByClassName("sphere-field");

    sphereFields[0].value = 0;
    sphereFields[1].value = 0;
    sphereFields[2].value = 0;

    sphereFields[3].value = 1;
}

function startStep8() {
    var cylinderEq = {
        id: 8,
        type: 'cylinder',
        coef: 1,
        position: [0, 0],
        radius: 1,
        bottom: 0,
        top: 3,
        height: 3,
        rotationAxes: ['90deg', '0', '0'],
        text: "Cylinder Tutorial: Step 8",
    };

    console.log("sent to server: " + cylinderEq);
    socket.emit('cylinderEqs', cylinderEq);

    console.log(cylinderEq);

    var cylinderFields = document.getElementsByClassName("cylinder-field");

    cylinderFields[0].value = 0;
    cylinderFields[1].value = 0;
    
    cylinderFields[2].value = 1;

    cylinderFields[3].value = 0;
    cylinderFields[4].value = 3;
}

function updateEquation(data) {
    if (data.type == 'sphere') {
        var sphereFields = document.getElementsByClassName("sphere-field");

        sphereFields[0].value = data.position[0];
        sphereFields[1].value = data.position[1];
        sphereFields[2].value = data.position[2];

        sphereFields[3].value = data.radius;

        if (data.id == 4) {
            if (data.position[0] == 2 && data.position[1] == 1 && data.position[2] == 3 && data.radius == 2) {
                alert("You got it right");
            }
        }
    } else if (data.type == 'cylinder') {
        var cylinderFields = document.getElementsByClassName("cylinder-field");

        cylinderFields[0].value = data.position[0];
        cylinderFields[1].value = data.position[1];
        
        cylinderFields[2].value = data.radius;

        cylinderFields[3].value = data.bottom;
        cylinderFields[4].value = data.top;

        if (data.id == 8) {
            if (data.position[0] == 2 && data.position[1] == 1 && data.radius == 2 && data.bottom == 2 && data.top == 5) {
                alert("You got it right");
            }
        }
    }
}

// --------------------------------------------
// ------------- Sphere Steps -----------------
// --------------------------------------------

function getStep1() {
    var container = document.createElement("div");
    container.id = "1";
    container.appendChild(getStepTitle("Step 1: Sphere Introduction:"));
    container.appendChild(getBody("A sphere is a 3D representation of the circle. The equation of the sphere is similar to that of the circle, but with an extra variable z for the extra dimension. So, this is an equation for a sphere -"));
    container.appendChild(getDisplayEq("(x - a)^2 + (y - b)^2 + (z - c)^2 = r^2"));
    container.appendChild(getBody("Sphere equation contains two parts :"));
    container.appendChild(getList(["The coordinate (a, b, c) tells us where the center of the sphere is. So, if a = b = c = 0, the sphere is centered on the origin.",
                                   "In equation, r represents the radius of the sphere. Note that the radius is squared."]));
    return container;
}

function getStep2() {
    var container = document.createElement("div");
    
    container.id = "2";
    container.appendChild(getStepTitle("Step 2: Understand Radius:"));
    container.appendChild(getBody("Radius determines the size of the sphere. If we know the center of the sphere and one of the point it passes through, we can solve the sphere equation to find the radius of the sphere."));
    container.appendChild(getSubTitle("Exercise: "));
    container.appendChild(getBody("Consider a sphere which is centered at (0, 0, 0) and passes through the point (1, 2 , 1). Complete the sphere equation below and check on the magic leap to see your sphere."));
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
    container.appendChild(spherePlayGroundEquation());
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
    container.appendChild(spherePlayGroundEquation());
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
    container.appendChild(spherePlayGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Graph Sphere", updateSphereEq));
    container.appendChild(document.createElement("br"));

    return container;
}

// --------------------------------------------
// ------------ Cylinder Steps ----------------
// --------------------------------------------

function getStep6() {
    var container = document.createElement("div");

    container.id = "6";
    container.appendChild(getStepTitle("Step 6: Cylinder Introduction:"));
    container.appendChild(getBody("A cylinder is a closed solid that has two parallel (usually circular) bases connected by a curved surface."));
    container.appendChild(getDisplayEq("(x - a)^2 + (y - b)^2 = r^2 where m < z < n"));
    container.appendChild(getBody("Cylinder equation contains three parts :"));
    container.appendChild(getList(["The coordinate (a, b) tells us where the center of the base is. So, if a = b = 0, the cylinder is centered on the origin.",
                                   "In equation, r represents the radius of the base of the cylinder. Note that the radius is squared.",
                                   "The range [m, n] specifies the range of the curved surface of the cylinder connecting the two bases i.e. (m - n) is height of the cylinder."]));
    
    return container;
}

function getStep7() {
    var container = document.createElement("div");
    
    container.id = "7";
    container.appendChild(getStepTitle("Step 7: Understand Radius and Height:"));
    container.appendChild(getBody("Radius of the cylinder determines the radius of the base. The height of the cylinder is the perpendicular distance between the two bases."));
    container.appendChild(getSubTitle("Exercise: "));
    container.appendChild(getBody("Consider a cylinder which is centered at (0, 0) and has a radius 2 and height 2. Complete the cylinder equation below and check on the magic leap to see your cylinder."));
    container.appendChild(getSpan("(x - 0)^2 + (y - 0)^2 = "));
    container.appendChild(getInput("step7Radius"));
    container.appendChild(getSpan(" ^2 where "));
    container.appendChild(getInput("step7Range"));
    container.appendChild(getSpan(" < z < 3"));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Check Cylinder", updateCylinderEq));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep8() {
    var container = document.createElement("div");

    container.id = "8";
    container.appendChild(getStepTitle("Step 8: Final Test"));
    container.appendChild(getBody("Check your magic leap, you will see a cylinder with radius 1 and centered at the origin with height 3. Interact with the cylinder and change it until it matches the following equation - "));
    container.appendChild(getSpan("(x - 2)^2 + (y - 1)^2 = 4 where 2 < z < 5"));
    container.appendChild(getBody("As you change the cylinder, you can see the updated values on this equation below - "));
    container.appendChild(cylinderPlayGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Start Step 8", startStep8));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep9() {
    var container = document.createElement("div");

    container.id = "9";
    container.appendChild(getStepTitle("Step 9: Playground"));
    container.appendChild(getBody("Now that you understand all the parts of the cylinder,  here is a template of a cylinder equation. Just play around with the values and check on the magic leap how is it getting plotted."));
    container.appendChild(cylinderPlayGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Graph Cylinder", updateCylinderEq));
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

    if (currStepNum == 9) {
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

    if (currStepNum < 9) {
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
    steps = {"1": getStep1(), "2": getStep2(), "3": getStep3(), "4": getStep4(), "5": getStep5(),
             "6": getStep6(), "7": getStep7(), "8": getStep8(), "9": getStep9()};

    $("stepContainer").appendChild(steps["1"]);
    $("next").onclick = nextStep;
    $("prev").onclick = prevStep;
    $("prev").disabled = true;
    $("prev").classList.add("disable");

    socket.emit('deleteAllEqs', "");
}