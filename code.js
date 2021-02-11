let current_shape = null;
let shape_list = [];
let touch_mode = false;
let touch_methods = null;
function shapeSelectorStartStop(event) {
	let target = event.target;
	event.preventDefault();
	if (touch_mode) {
		if (touch_methods !== null) {
			for (let i in touch_methods) {
				let method = touch_methods[i];
				if (method.call === "undef_global") {
					codeOutput(LEVEL.ERROR, "Call " + i + ": Attempt to index a nil value (global '" + method.name + "')");
				} else if (method.call === "undef_field") {
					codeOutput(LEVEL.ERROR, "Call " + i + ": Attempt to index a nil value (field '" + method.name + "')");
				} else {
					let args = JSON.parse(JSON.stringify(method.args));
					for (let i in args) {
						if (args[i] === "x")
							args[i] = target.getAttribute("data-x");
						else if (args[i] === "y")
							args[i] = target.getAttribute("data-y");
					}
					let ret = method.call(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
					if (typeof ret === "undefined" || ret === null)
						ret = "nil";
					codeOutput(LEVEL.MSG, "Call " + i + ": " + ret);
				}
			}
		}
	} else if (current_shape == null) {
		current_shape = document.createElement("div");
		current_shape.className = "shape";

		let x = target.getAttribute("data-x");
		let y = target.getAttribute("data-y");
		let w = 1;
		let h = 1;

		current_shape.style.backgroundColor = "white";
		current_shape.style.width = w * pixelWidth + "px";
		current_shape.style.height = h * pixelHeight + "px";
		current_shape.style.top = (y -1) * pixelHeight + "px";
		current_shape.style.left = (x -1) * pixelWidth + "px";
		current_shape.setAttribute("data-x", x);
		current_shape.setAttribute("data-y", y);
		current_shape.setAttribute("data-width", w);
		current_shape.setAttribute("data-height", h);
		selector_shape_container.appendChild(current_shape);
	} else {
		console.info(current_shape);
		shape_container.appendChild(current_shape);
		current_shape.style.display = "none";
		shape_list.push(current_shape);
		current_shape = null;
		update_shape_list();
	}
}

function shapeSelectorMove(event) {
	if (current_shape != null) {
		let target = event.target;
		let x = current_shape.getAttribute("data-x");
		let y = current_shape.getAttribute("data-y");
		let w = target.getAttribute("data-x") - x;
		let h = target.getAttribute("data-y") - y;

		current_shape.style.width = (w +1) * pixelWidth + "px";
		current_shape.style.height = (h +1) * pixelHeight + "px";
		current_shape.style.top = (y -1) * pixelHeight + "px";
		current_shape.style.left = (x -1) * pixelWidth + "px";
		current_shape.setAttribute("data-x", x);
		current_shape.setAttribute("data-y", y);
		current_shape.setAttribute("data-width", w+1);
		current_shape.setAttribute("data-height", h+1);
	}
}

function generateMethodCall(method, args) {
	let ret = false;
	if (method === "gpu.set")
		ret = "gpu.set(" + args.x + ", " + args.y + ", \"My text\")";
	else if (method === "gpu.fill")
		ret = "gpu.fill(" + args.x + ", " + args.y + ", " + args.w + ", " + args.h + ", \" \")";
	else if (method === "gpu.setBackground")
		ret = "gpu.setBackground(" + args.color + ")";
	else if (method === "gpu.setForeground")
		ret = "gpu.setForeground(" + args.color + ")";
	return ret;
}

function generateAndInsertMethodCall(method, args) {
	code_area.value += generateMethodCall(method, args) + "\n";
}

function parseCode(code) {
	let methods = [];
	let re = /(.*\.)?(.*?)\((.*)\)/g;
	let matches;
	let counter = 0;
	while ((matches = re.exec(code)) !== null) {
		counter++;
		let libs = matches[1].split(".");
		let func = matches[2];
		let args = matches[3].split(",")
		for (let i in args) {
			args[i] = args[i].trim();
			if (!args[i].startsWith("0x")) {
				let match = /^\"(.*)\"$/.exec(args[i]);
				if (match != null)
					args[i] = match[1];
				else if (!isNaN(parseFloat(args[i])))
					args[i] = parseFloat(args[i]);
				else if (args[i] === "true")
					args[i] = true;
				else if (args[i] === "false")
					args[i] = false;
			}
		}
		let callme = oc;
		for (let i = 0; i < libs.length; i++) {
			if (libs[i] !== "") {
				if (typeof callme[libs[i]] === "undefined") {
					methods.push({ call: "undef_" + (i === 0 ? "global" : "field"), name: libs[i] });
				} else {
					callme = callme[libs[i]];
				}
			}
		}
		if (typeof callme[func] === "undefined") {
			methods.push("undef_field");
		} else {
			methods.push({ call: callme[func], args: args, name: func });
		}
	}
	return methods;
}