function set_msg(msg) {
	let container = document.getElementById("messages");
	container.style.color = "white";
	container.innerHTML = msg;
}

function set_err(msg) {
	let container = document.getElementById("messages");
	container.style.color = "orange";
	container.innerHTML = msg;
}

function SetResolutionControl() {
	let width = document.getElementById("res_width").value;
	let height = document.getElementById("res_height").value;
	if (width > 0 && height > 0)
		setResolution(document.getElementById("monitor"), width, height);
	else
		set_err("Width and height must be greater than zero.");
}

function setScreenSizeControl() {
	let width = document.getElementById("block_width").value;
	let height = document.getElementById("block_height").value;
	if (width > 0 && height > 0)
		setScreenSize(width, height);
	else
		set_err("Width and height must be greater than zero.");
}

function updateShapeList() {
	shape_list_container.innerHTML = "";
	let counter = 0;
	for (let i in shape_list) {
		let shape = shape_list[i];
		if (shape != null) {
			counter++;
			let div = document.createElement("div");
			div.innerHTML = "X: " + shape.getAttribute("data-x") + " Y: " + shape.getAttribute("data-y");
			div.innerHTML += " Width: " + shape.getAttribute("data-width") + " Height: " + shape.getAttribute("data-height");
			div.style.cursor = "pointer";
			let del = document.createElement("span");
			del.className = "del_button";
			del.innerText = "DEL";
			del.style.float = "right";
			del.setAttribute("data-index", i);
			del.onclick = function (event) {
				let index = event.target.getAttribute("data-index");
				shape_container.removeChild(shape_list[index]);
				shape_list[index] = null;
				updateShapeList();
				saveShapes();
			};
			div.appendChild(del);
			div.setAttribute("data-index", i);
			div.onmouseover = function (event) {
				let index = event.target.getAttribute("data-index");
				let shape = shape_list[index];
				if (typeof shape !== "undefined" && shape !== null) {
					if (!shape.hasAttribute("data-display"))
						shape_list[index].style.display = null;
				}
			};
			div.onmouseout = function (event) {
				let index = event.target.getAttribute("data-index");
				let shape = shape_list[index];
				if (typeof shape !== "undefined" && shape !== null) {
					if (!shape.hasAttribute("data-display"))
						shape_list[index].style.display = "none";
				}
			};
			div.onclick = function(event) {
				let index = event.target.getAttribute("data-index");
				let shape = shape_list[index];
				if (typeof shape !== "undefined" && shape !== null)
					if (shape.hasAttribute("data-display")) {
						shape.removeAttribute("data-display");
						shape.style.display = "none";
					} else {
						shape.setAttribute("data-display", 1);
						shape.style.display = null;
					}
			};
			div.oncontextmenu = function(event) {
				event.preventDefault();
				let index = event.target.getAttribute("data-index");
				let shape = shape_list[index];
				let x = shape.getAttribute("data-x");
				let y = shape.getAttribute("data-y");
				let w = shape.getAttribute("data-width");
				let h = shape.getAttribute("data-height");
				createContextMenu({
					title_menu: { label: "Generate", class: "title" },
					title_gpu: { label: "GPU", class: "title" },
					fill: { label: "`gpu.fill`", onclick: function(event) { code_area.value = generateAndInsertMethodCall(code_area.value,"gpu.fill", { x: x, y: y, w: w, h: h }); saveInputField(code_area); }},
					set: { label: "`gpu.set`", onclick: function(event) { code_area.value = generateAndInsertMethodCall(code_area.value, "gpu.set", { x: x, y: y }); saveInputField(code_area); }},
					title_fgui: { label: "fgui", class: "title" },
					center: { label: "`fgui.writeTextCentered`", onclick: function(event) { code_area.value = generateAndInsertMethodCall(code_area.value, "fgui.writeTextCentered", { x: x, y: y, w: w, h: h }); saveInputField(code_area); }},
					button: { label: "`fgui.createButton`", onclick: function(event) { code_area.value = generateAndInsertMethodCall(code_area.value,"fgui.createButton", { x: x, y: y, w: w, h: h }); saveInputField(code_area); } },
					title_tests: { label: "Tests", class: "title" },
					button_if: { label: "Button if-statement", onclick: function(event) { code_area_touch.value = generateAndInsertCode(code_area_touch.value, "if x > " + (x - 1) + " and x < " + (parseInt(x) + parseInt(w)) + " and y > " + (y - 1) + " and y < " + (parseInt(y) + parseInt(h)) + " then\n  print(\"You clicked me!\")\nend"); saveInputField(code_area_touch); }}
				}, event.clientX, event.clientY);
			}
			shape_list_container.appendChild(div);
		}
	}
	if (counter === 0) {
		shape_list_container.innerHTML = "No shapes drawn yet.";
	}
}

let LEVEL = {
	ERROR: "error",
	SUCCESS: "success",
	MSG: "msg",
	INFO: "info",
	WARN: "warn",
}

function codeOutputClear() {
	code_output.innerHTML = "";
}

function codeOutput(level, msg) {
	let div = document.createElement("div");
	if (level === LEVEL.ERROR)
		div.style.color = "red";
	else if (level === LEVEL.SUCCESS)
		div.style.color = "green";
	else if (level === LEVEL.INFO)
		div.style.color = "lightblue";
	else if (level === "LEVEL.WARN")
		div.style.color = "orange";
	div.innerText = msg;
	code_output.appendChild(div);
}

let open_context_menu = null;
function createContextMenu(options, x, y) {
	destroyContextMenu();
	let menu = document.createElement("div");
	menu.className = "context_menu";
	menu.onclick = function(event) {
		destroyContextMenu();
	};
	menu.style.top = y + "px";
	menu.style.left = x + "px";
	for (let option in options) {
		let opt = options[option];
		let item = document.createElement("div");
		item.className = "context_item";
		if (opt.hasOwnProperty("class"))
			item.className += "_" + opt.class;
		item.innerText = opt.label;
		item.onclick = opt.onclick;
		menu.appendChild(item);
	}
	open_context_menu = menu;
	document.body.insertBefore(menu, document.body.children[0]);
}

function destroyContextMenu() {
	if (open_context_menu != null) {
		document.body.removeChild(open_context_menu);
		open_context_menu = null;
	}
}

function setShapesOpacity(value) {
	for (let i in document.styleSheets[0].cssRules) {
		let rule = document.styleSheets[0].cssRules[i];
		if (rule.selectorText === ".shape")
			rule.style.backgroundColor = "rgba(255, 255, 255, " + (value / 100) + ")";
	}
}

function setGridOpacity(value) {
	for (let i in document.styleSheets[0].cssRules) {
		let rule = document.styleSheets[0].cssRules[i];
		if (rule.selectorText === ".grid_border")
			rule.style.borderColor = "rgba(255, 255, 255, " + (value / 100) + ")";
	}
}

function saveInputField(field) {
	if (typeof field.id !== "undefined" && field.id !== null && field.id !== "") {
		let key = "textarea_" + field.id;
		localStorage[key] = field.value;
	}
}

function loadInputField(field) {
	if (typeof field.id !== "undefined" && field.id !== null && field.id !== "") {
		let key = "textarea_" + field.id;
		if (typeof localStorage[key] !== "undefined" && localStorage[key] !== null && localStorage[key] !== "") {
			field.value = localStorage[key];
		}
	}
}

function saveShapes() {
	let shapes = [];
	for (let i in shape_list) {
		let shape = shape_list[i];
		if (shape !== null)
			shapes.push({ x: shape.getAttribute("data-x"), y: shape.getAttribute("data-y"), w: shape.getAttribute("data-width"), h: shape.getAttribute("data-height") });
	}
	localStorage["shapes"] = JSON.stringify(shapes);
}

function loadShapes() {
	if (typeof localStorage["shapes"] !== "undefined" && localStorage["shapes"] !== null) {
		let shapes = JSON.parse(localStorage["shapes"]);
		for (let i in shapes) {
			let shape = shapes[i];
			let sh = createShape(shape.x, shape.y, shape.w, shape.h, false);
			shape_container.appendChild(sh);
			shape_list.push(sh);
		}
		updateShapeList();
	}
}

function createShape(x, y, w, h, display = true) {
	let shape = document.createElement("div");
	shape.className = "shape";

	if (!display)
		shape.style.display = "none";
	shape.style.width = w * pixelWidth + "px";
	shape.style.height = h * pixelHeight + "px";
	shape.style.top = (y - 1) * pixelHeight + "px";
	shape.style.left = (x - 1) * pixelWidth + "px";
	shape.setAttribute("data-x", x);
	shape.setAttribute("data-y", y);
	shape.setAttribute("data-width", w);
	shape.setAttribute("data-height", h);
	return shape;
}

function displayCoordinates(x, y) {
	try {
		document.getElementById("x" + x).style.display = "block";
		document.getElementById("y" + y).style.display = "block";
	} catch (e) {}
}

function hideCoordinates(x, y) {
	try {
		document.getElementById("x" + x).style.display = "none";
		document.getElementById("y" + y).style.display = "none";
	} catch (e) {}
}

function pixelSelectOnMouseOver(event) {
	shapeSelectorMove(event);
	displayCoordinates(event.target.getAttribute("data-x"), event.target.getAttribute("data-y"));
}

function pixelSelectOnMouseOut(event) {
	hideCoordinates(event.target.getAttribute("data-x"), event.target.getAttribute("data-y"));
}