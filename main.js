function run() {
	codeOutputClear();

	if (code_area.value === "") {
		codeOutput(LEVEL.ERROR, "No code to parse.");
		return;
	}

	try {
		let code = code_area.value;
		let ret = fengari.load(code)();
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
	codeOutput(LEVEL.MSG, "Main block complete");
	if (code_area_touch.value === "") {
		codeOutput(LEVEL.INFO, "No OnTouch code to parse. Stopping.");
		stop();
		return;
	}
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