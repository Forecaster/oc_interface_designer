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
		setResolution(width, height);
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

function update_shape_list() {
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
				update_shape_list();
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
					fill: { label: "Generate `gpu.fill`", onclick: function(event) { generateAndInsertMethodCall("gpu.fill", { x: x, y: y, w: w, h: h }) }},
					set: { label: "Generate `gpu.set`", onclick: function(event) { generateAndInsertMethodCall("gpu.set", { x: x, y: y }); }}
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
	INFO: "info"
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