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

function ellipsoidPlayGroundEquation() {
    var container = document.createElement('div');

    container.appendChild(getSpan(" Equation :"));
    container.appendChild(getSpan(" (x - "));
    container.appendChild(getInput("ellipsoid-field"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field"));
    container.appendChild(getSpan(" ^ 2 + "));
    container.appendChild(getSpan(" (y - "));
    container.appendChild(getInput("ellipsoid-field"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field"));
    container.appendChild(getSpan(" ^ 2 + "));
    container.appendChild(getSpan(" (z - "));
    container.appendChild(getInput("ellipsoid-field"));
    container.appendChild(getSpan(" )^2 / "));
    container.appendChild(getInput("ellipsoid-field"));
    container.appendChild(getSpan(" ^ 2 = 1"));

    return container;
}

function updateConeEq() {
    if (currStepNum == 2) {
        var values = C("step2");

        if (values[0].value == 0) {
            alert("Enter a value");
            return;
        }

        var coneEq = {
            id: "2",
            type: 'cone',
            coef: "1",
            position: ["0", "0"],
            radius: "2",
            bottom: "1", // lower bound
            top: values[0].value, // higher bound
            height: values[0].value -  1, //  top - bottom
            rotationAxes: ['90deg', '0', '0'],
            order: ["x", "y", "z"],
            text: "Cone Tutorial: Step 2",
        };

        console.log("sent to server: " + coneEq);
        socket.emit('coneEqs', coneEq);

        console.log(coneEq);

        if (values[0].value == 5) {
            alert("You got it right");
        }
    } else if (currStepNum == 4) {
        var values = C("cone-field");

        if (!values[0].value || !values[1].value || !values[2].value || !values[3].value || !values[4].value || !values[5].value) {
            alert("Please Enter all values");
            return;
        }

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
            return;
        }

        var h1 = parseInt(values[5].value) - parseInt(values[4].value);
        var h2 = parseFloat(values[2].value) / parseFloat(values[3].value);

        if (h1 != h2) {
            alert("m - n height should be same as r / c height");
            return null;
        }

        var coneEq = {
            id: "4",
            type: 'cone',
            coef: "1",
            position: [values[0].value, values[1].value],
            radius: values[2].value,
            bottom: values[4].value, // lower bound
            top: values[5].value, // higher bound
            height: values[5].value - values[4].value, //  top - bottom
            rotationAxes: ['90deg', '0', '0'],
            order: ["x", "y", "z"],
            text: "Cone Tutorial: Step 4",
        };

        console.log("sent to server: " + coneEq);
        socket.emit('sphereEqs', coneEq);

        console.log(coneEq);
    }
}

function updateEllipsoidEq() {
    if (currStepNum == 6) {
        var values = C("step6");

        if (!values[0].value || !values[1].value || !values[2].value) {
            alert("Please enter all values");
            return null;
        }

        if (values[0].value == 0 ||
            values[1].value == 0 ||
            values[2].value == 0) {
            alert("Denominators of X, Y and Z cannot be zero");
            return null;
        }

        if (values[0].value > 5 ||
            values[1].value > 5 ||
            values[2].value > 5) {
            alert("Maximum radius allowed is 5");
            return null;
        }

        // what equations should look like for a sphere
        var ellipsoidEq = {
            id: "6",
            type: 'ellipsoid',
            coef: "1",
            position: ["0", "0", "0"],
            radius: 1,
            denoms: [values[0].value, values[1].value, values[2].value],
            text: "Ellipsoid Tutorial: Step 6",
        };

        console.log("sent to server: " + ellipsoidEq);
        socket.emit('sphereEqs', ellipsoidEq);

        console.log(ellipsoidEq);

        if (values[0].value == 3 ||
            values[1].value == 2 ||
            values[2].value == 4) {
            alert("You got it right!");
        }
    } else if (currStepNum == 8) {
        var values = C("ellipsoid-field");

        if (!values[0].value || !values[1].value || !values[2].value ||
            !values[3].value || !values[4].value || !values[5].value) {
            alert("Please enter all values");
            return null;
        }

        if (values[1].value == 0 ||
            values[3].value == 0 ||
            values[5].value == 0) {
            alert("Denominators of X, Y and Z cannot be zero");
            return null;
        }

        if (values[1].value > 5 ||
            values[3].value > 5 ||
            values[5].value > 5) {
            alert("Maximum radius allowed is 5");
            return null;
        }

        // what equations should look like for a sphere
        var ellipsoidEq = {
            id: "8",
            type: 'ellipsoid',
            coef: "1",
            position: [values[0].value, values[2].value, values[4].value],
            radius: 1,
            denoms: [values[1].value, values[3].value, values[5].value],
            text: "Ellipsoid Tutorial: Step 8",
        };

        console.log("sent to server: " + ellipsoidEq);
        socket.emit('sphereEqs', ellipsoidEq);

        console.log(ellipsoidEq);
    }
}

function startStep3() {
    var coneEq = {
        id: "3",
        type: 'cone',
        coef: "1",
        position: ["0", "0"],
        radius: "1",
        bottom: "1", // lower bound
        top: "2", // higher bound
        height: 1, //  top - bottom
        rotationAxes: ['90deg', '0', '0'],
        order: ["x", "y", "z"],
        text: "Cone Tutorial: Step 3",
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

function startStep7() {
    var ellipsoidEq = {
        id: "7",
        type: 'ellipsoid',
        coef: "1",
        position: ["0", "0", "0"],
        radius: 1,
        denoms: ["1", "1", "1"],
        text: "Ellipsoid Tutorial: Step 7",
    };

    console.log("sent to server: " + ellipsoidEq);
    socket.emit('sphereEqs', ellipsoidEq);

    console.log(ellipsoidEq);

    var ellipsoidFields = document.getElementsByClassName("ellipsoid-field");

    ellipsoidFields[0].value = 0;
    ellipsoidFields[2].value = 0;
    ellipsoidFields[4].value = 0;
    
    ellipsoidFields[1].value = 1;
    ellipsoidFields[3].value = 1;
    ellipsoidFields[5].value = 1;
}

function updateEquation(data) {
    if (data.type == 'cone' && data.id > 2) {
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
    } else if (data.type == 'ellipsoid' && data.id > 6) {
        var ellipsoidFields = document.getElementsByClassName("ellipsoid-field");

        ellipsoidFields[0].value = data.position[0];
        ellipsoidFields[2].value = data.position[1];
        ellipsoidFields[4].value = data.position[2];

        ellipsoidFields[1].value = data.denoms[0];
        ellipsoidFields[3].value = data.denoms[1];
        ellipsoidFields[5].value = data.denoms[2];

        if (data.id == 7) {
            if (data.position[0] == 2 && data.position[1] == 1 && data.position[2] == 3 && 
                data.denoms[0] == 2 && data.denoms[1] == 1 && data.denoms[2] == 3) {
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
    container.appendChild(getSpan("(x - 0)^2 + (y - 0)^2 = 4 / 0.5 where 1 < z <  "));
    container.appendChild(getInput("step2"));
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

// --------------------------------------------
// ------------ Ellipsoid Steps ---------------
// --------------------------------------------

function getStep5() {
    var container = document.createElement("div");

    container.id = "5";
    container.appendChild(getStepTitle("Step 5: Ellipsoid Introduction:"));
    container.appendChild(getBody("An ellipsoid is a surface that can be obtained by deforming a sphere by means of directional scalings."));
    container.appendChild(getDisplayEq("(x - a)^2 / u^2 + (y - b)^2 / v^2 + (z - b)^2 / w^2 = 1"));
    container.appendChild(getBody("Ellipsoid equation contains two parts :"));
    container.appendChild(getList(["The coordinates (a, b. c) tells us where the center of the ellipsoid is. So, if a = b = c = 0, the ellipsoid is centered on the origin.",
                                   "The values (u, v, w) represents the radius of the ellisoid on (x, y, z) axis respectively"]));
    container.appendChild(getBody("If u = v = w then its just a sphere, if u = v != w i.e. two radii are equal and the third one is different, then its called a spheroid and if all three are different then it is called an ellipsoid."));                            
    return container;
}

function getStep6() {
    var container = document.createElement("div");
    
    container.id = "6";
    container.appendChild(getStepTitle("Step 6: Understand radii:"));
    container.appendChild(getBody("If u = v = w then its just a sphere, if u = v != w i.e. two radii are equal and the third one is different, then its called a spheroid and if all three are different then it is called an ellipsoid."));
    container.appendChild(getSubTitle("Exercise: "));
    container.appendChild(getBody("Consider a ellipsoid which is centered at (0, 0, 0) and whose x-axis radius is 3, y-axis radius is 2 and z-axis radius is 4. Complete the ellisoid equation below and check on the magic leap to see your ellipsoid."));
    container.appendChild(getSpan("(x - 0)^2 /  "));
    container.appendChild(getInput("step6"));
    container.appendChild(getSpan(" + (y - 0)^2 /  "));
    container.appendChild(getInput("step6"));
    container.appendChild(getSpan(" + (z - 0)^2 /  "));
    container.appendChild(getInput("step6"));
    container.appendChild(getSpan("^2 = 1"));
    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Check Ellipsoid", updateEllipsoidEq));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep7() {
    var container = document.createElement("div");

    container.id = "7";
    container.appendChild(getStepTitle("Step 7: Final Test"));
    container.appendChild(getBody("Check your magic leap, you will see a sphere with radius 1 and centered at the origin. Interact with the sphere and change it until it matches the following equation of the ellipsoid -"));
    container.appendChild(getSpan("(x - 2)^2 / 4 + (y - 1)^2 / 1 + (z - 3)^2 / 9 = 1"));
    container.appendChild(getBody("As you change the ellipsoid, you can see the updated values on this equation below - "));
    container.appendChild(ellipsoidPlayGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Start Step 7", startStep7));
    container.appendChild(document.createElement("br"));

    return container;
}

function getStep8() {
    var container = document.createElement("div");

    container.id = "8";
    container.appendChild(getStepTitle("Step 8: Playground"));
    container.appendChild(getBody("Now that you understand all the parts of the ellipsoid,  here is a template of a ellipsoid equation. Just play around with the values and check on the magic leap how is it getting plotted."));
    container.appendChild(ellipsoidPlayGroundEquation());
    container.appendChild(document.createElement("br"));
    container.appendChild(getButton("Graph Ellipsoid", updateEllipsoidEq));
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

    if (currStepNum == 8) {
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

    if (currStepNum < 8) {
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
    steps = {"1": getStep1(), "2": getStep2(), "3": getStep3(), "4": getStep4(),
             "5": getStep5(), "6": getStep6(), "7": getStep7(), "8": getStep8()};

    $("stepContainer").appendChild(steps["1"]);
    $("next").onclick = nextStep;
    $("prev").onclick = prevStep;
    $("prev").disabled = true;
    $("prev").classList.add("disable");

    socket.emit('deleteAllEqs', "");
}