let current_shape = null;
let shape_list = [];
let touch_mode = false;
let touch_methods = null;
function shapeSelectorStartStop(event) {
	const target = event.target;
	const x = target.getAttribute("data-x");
	const y = target.getAttribute("data-y");
	event.preventDefault();
	if (touch_mode) {
		try {
			let code = "local x = " + x + "\nlocal y = " + y + "\n" + code_area_touch.value;
			let ret = fengari.load(code)();
			console.debug(ret);
			if (ret)
				codeOutput(LEVEL.MSG, ret);
		} catch (ex) {
			if (typeof ex === "string") {
				codeOutput(LEVEL.ERROR, ex);
				return;
			}
			codeOutput(LEVEL.ERROR, "An internal error occurred: " + ex.name);
			console.error(ex);
			return;
		}
	} else if (current_shape == null) {
		current_shape = createShape(x, y, 1, 1);
		selector_shape_container.appendChild(current_shape);
	} else {
		console.info(current_shape);
		shape_container.appendChild(current_shape);
		current_shape.style.display = "none";
		shape_list.push(current_shape);
		current_shape = null;
		updateShapeList();
		saveShapes();
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
	else if (method === "fgui.writeTextCentered")
		ret = "fgui.writeTextCentered(\"My Text\", " + args.x + ", " + args.y + ", " + args.w + ", " + args.h + ")";
	else if (method === "fgui.createButton")
		ret = "fgui.createButton(\"mybutton\", \"My Button\", " + args.x + ", " + args.y + ", " + args.w + ", " + args.h + ")";
	return ret;
}

function generateAndInsertMethodCall(pre_content, method, args) {
	const meth = generateMethodCall(method, args);
	if (meth) {
		if (pre_content !== "" && pre_content.substr(pre_content.length - 1) !== "\n")
			pre_content += "\n";
		pre_content += meth + "\n";
	}
	return pre_content;
}

function generateAndInsertCode(pre_content, code, args) {
	pre_content += code;
	return pre_content;
}

function parseCode(code) {
	let methods = [];
	let re = /(.*\.)?(.*?)\((.*)\)/g;
	let matches;
	let counter = 0;
	while ((matches = re.exec(code)) !== null) {
		counter++;
		let libs = [];
		if (typeof matches[1] !== "undefined")
			libs = matches[1].split(".");
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