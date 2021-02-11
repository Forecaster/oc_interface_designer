function run() {
	codeOutputClear();

	if (code_area.value === "") {
		codeOutput(LEVEL.ERROR, "No code to parse.");
		return;
	}

	let methods = parseCode(code_area.value);
	console.info(methods);
	for (let i in methods) {
		let method = methods[i];
		if (method.call === "undef_global") {
			codeOutput(LEVEL.ERROR, "Call " + i + ": Attempt to index a nil value (global '" + method.name + "')");
		} else if (method.call === "undef_field") {
			codeOutput(LEVEL.ERROR, "Call " + i + ": Attempt to index a nil value (field '" + method.name + "')");
		} else {
			let ret = method.call(method.args[0], method.args[1], method.args[2], method.args[3], method.args[4], method.args[5], method.args[6], method.args[7], method.args[8]);
			if (typeof ret === "undefined" || ret === null)
				ret = "nil";
			codeOutput(LEVEL.MSG, "Call " + i + ": " + ret);
		}
	}
	codeOutput(LEVEL.MSG, "Main block complete");
	if (code_area_touch.value === "") {
		codeOutput(LEVEL.INFO, "No OnTouch code to parse. Stopping.");
		stop();
		return;
	}
	touch_methods = parseCode(code_area_touch.value);

	touch_mode = true;
	code_area.setAttribute("disabled", "disabled");
	code_area_touch.setAttribute("disabled", "disabled");
	code_start.setAttribute("disabled", "disabled");
	code_stop.removeAttribute("disabled");
	current_mode.innerText = "RUNNING";
	current_mode.style.color = "green";
}

function stop() {
	touch_mode = false;
	code_stop.setAttribute("disabled", "disabled");
	code_start.removeAttribute("disabled");
	code_area.removeAttribute("disabled");
	code_area_touch.removeAttribute("disabled");
	current_mode.innerText = "EDIT";
	current_mode.style.color = "red";
}