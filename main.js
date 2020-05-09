function SetResolutionControl() {
	let width = document.getElementById("res_width").value;
	let height = document.getElementById("res_height").value;
	if (width > 0 && height > 0)
		setResolution(width, height);
	else
		set_err("Width and height must be greater than zero.");
}

function setResolution(w, h) {
	width = w;
	height = h;
	if ((width * height) > max_resolution_area) {
		set_err("Cannot exceed max resolution area (" + max_resolution_area + ")");
		return;
	}
	console.log("Setting resolution to " + width + "x" + height);

	let monitor = document.getElementById("monitor");
	monitor.innerHTML = "<div id=\"shape_container\"></div>";

	// var coordinate_row = document.createElement("div");
	// coordinate_row.className = "row";
	// coordinate_row.innerHTML += "<span class='coordinate' style='width: 1em'>*</span>";
	//
	// for (var i = 1; i < h; i++)
	// {
	//   coordinate_row.innerHTML += "<span class=\"coordinate\">" + i + "</span>";
	// }
	//
	// monitor.appendChild(coordinate_row);

	for (let i = 1; i <= h; i++) {
		let row_div = document.createElement("div");
		row_div.className = "row";

		let div = document.createElement("div");
		// div.className = "coordinate";
		// div.innerHTML = i;
		// div.style.width = "1em";
		// row_div.appendChild(div);
		for (let x = 1; x <= w; x++) {
			div = document.createElement("div");
			div.className = "pixel";
			div.id = x + "," + i;
			div.title = x + "," + i;
			div.onclick = fillSelection;
			row_div.appendChild(div);
		}
		monitor.appendChild(row_div);
	}
	document.getElementById("res_width").value = width;
	document.getElementById("res_height").value = height;
	console.info(updateMonitorScale());
}

function setBackground(hex) {
	background = "#" + hex;
	update_current_colors();
}

function setForeground(hex) {
	foreground = "#" + hex;
	update_current_colors();
}

function fill(xA, yA, xB, yB, char) {
	let ypos = 0;
	let xpos = 0;
	let rows = 0;
	let pixels = 0;
	if (typeof char == "undefined" || char == null)
		char = " ";
	console.log("Filling from " + xA + ", " + yA + " to " + xB + ", " + yB + " (" + char + ")");
	console.log("Starting loop between row " + yA + " and row " + yB);
	console.log(yA + " <= " + yB + ": " + (yA <= yB));
	for (ypos = yA; ypos <= yB; ypos++) {
		rows++;
		console.log("Starting loop between column " + xA + " and column " + xB);
		for (xpos = xA; xpos <= xB; xpos++) {
			pixels++;
			console.log("Getting pixel at " + xpos + ", " + ypos);
			var pixel = document.getElementById(xpos + "," + ypos);
			if (pixel != null) {
				console.log("Setting pixel at " + xpos + ", " + ypos);
				pixel.style.backgroundColor = background;
				pixel.style.color = foreground;
				pixel.innerHTML = char;
			} else
				console.error("Tried to get pixel at " + xpos + ", " + ypos + " that does not exist");
		}
	}
	console.log("Modified " + rows + " rows");
	console.log("Modified " + pixels + " pixels");
}

function fillSelection(event) {
	let positions = event.target.id.split(",");
	if (selectAposX == null) {
		event.target.style.backgroundColor = "yellow";
		console.log("Selected position A at " + positions[0] + ", " + positions[1]);
		selectAposX = parseInt(positions[0]);
		selectAposY = parseInt(positions[1]);
	} else {
		document.getElementById(selectAposX + "," + selectAposY).style.backgroundColor = null;
		console.log("Selected position B at " + positions[0] + ", " + positions[1]);
		selectBposX = parseInt(positions[0]);
		selectBposY = parseInt(positions[1]);
		shapeButton();
	}
}

function shapeButton() {
	let w = 0;
	let x = 0;
	if (selectAposX < selectBposX) {
		x = selectAposX;
		w = selectBposX - selectAposX;
	} else {
		x = selectBposX;
		w = selectAposX - selectBposX;
	}
	let h = 0;
	let y = 0;
	if (selectAposY < selectBposY) {
		y = selectAposY;
		h = selectBposY - selectAposY;
	} else {
		y = selectBposY;
		h = selectAposY - selectBposY;
	}
	createShape(x, y, w, h);
	clear_selection();
}

function clear_selection() {
	selectAposX = null;
	selectAposY = null;
	selectBposX = null;
	selectBposY = null;
}

function createShape(x, y, w, h) {
	x--;
	y--;
	w++;
	h++;
	let container = document.getElementById("shape_container");
	let div = document.createElement("div");
	let id = shapes.length;
	div.id = "shape_" + id;
	div.className = "shape";
	div.style.backgroundColor = background;
	div.style.width = w * pixelWidth + "px";
	div.style.height = h * pixelHeight + "px";
	div.style.top = y * pixelHeight + "px";
	div.style.left = x * pixelWidth + "px";
	div.setAttribute("data-x", x);
	div.setAttribute("data-y", y);
	div.setAttribute("data-width", w);
	div.setAttribute("data-height", h);
	div.setAttribute("data-id", id.toString());
	div.onclick = manage_shape;

	container.prepend(div);
	shapes.push(div);
	update_all_shape_code();
	return true;
}

function get_shape_data(shape_id) {
	let shape = shapes[shape_id];
	let x = parseInt(shape.getAttribute("data-x")) + 1;
	let y = parseInt(shape.getAttribute("data-y")) + 1;
	let w = parseInt(shape.getAttribute("data-width"));
	let h = parseInt(shape.getAttribute("data-height"));
	let fill_code = "gpu.fill(" + x + "," + y + "," + w + "," + h + ",\" \")";
	let pull_code = "if x >= " + x + " and x <= " + (x + (w - 1)) + " and y >= " + y + " and y <= " + (y + (h - 1)) + " then\n  --put your onclick code here\nend";
	return { x: x, y: y, w: w, h: h, code: { fill: fill_code, touch: pull_code }};
}

function manage_shape(event) {
	selected_shape_id = event.target.getAttribute("data-id");
	let shape = get_shape_data(selected_shape_id);
	document.getElementById("fill_code").value = shape.code.fill;
	document.getElementById("pull_code").value = shape.code.touch;
	document.getElementById("shape_controls").style.display = null;
}

function delete_shape(id) {
	let shape_container = document.getElementById("shape_container");
	let shape = shapes[id];
	shapes[id] = null;
	shape_container.removeChild(shape);
	document.getElementById("shape_controls").style.display = "none";
	update_all_shape_code();
}

function update_all_shape_code() {
	let shape_code = [];
	for (let i = 0; i < shapes.length; i++) {
		let shape = get_shape_data(i);
		shape_code.push(shape.code.fill);
	}
	document.getElementById("all_shapes").value = shape_code.join("\n");
}

function generate_color_picker() {
	let row_key = "";
	let blo_key = "";
	let col_key = "";
	let container = "";
	for (let i = 0; i < colors.rows.length; i++) {
		row_key = colors.rows[i];
		container += "<div class=\"color-row\">";
		for (let a = 0; a < colors.blocks.length; a++) {
			blo_key = colors.blocks[a];
			for (let b = 0; b < colors.columns.length; b++) {
				col_key = colors.columns[b];
				container += "<div onclick=\"pick_color(this);\" title=\"" + row_key + blo_key + col_key + "\" style=\"background-color: #" + row_key + blo_key + col_key + ";\" class=\"color-cube\"></div>";
			}
		}
		container += "</div>";
	}

	container += "<div class=\"color-row\">";
	for (let t = 0; t < colors.grays.length; t++) {
		let key = colors.grays[t];
		container += "<div onclick=\"pick_color(this);\" title=\"" + key + key + key + "\" style=\"background-color: #" + key + key + key + ";\" class=\"color-cube\"></div>";
	}
	container += "</div>";

	document.getElementById("color_picker").innerHTML = container;
}

function setForegroundTarget() {
	target = "foreground";
}

function setBackgroundTarget() {
	target = "background";
}

function pick_color(element) {
	document.getElementById("color_value").value = "#" + element.title;
	document.getElementById("color_value_computronics").value = "0x" + element.title;

	console.log(element.title);
	if (target === "background")
		setBackground(element.title);
	else
		setForeground(element.title);
}

function update_current_colors() {
	console.log("Update current color display");
	console.log(background);
	let elem = document.getElementById("current_colors");
	elem.style.backgroundColor = background;
	elem.style.color = foreground;
}

function generate_preset_buttons() {
	let container = document.getElementById("resolution_presets");

	container.innerHTMl = "";

	for (let key in resolution_presets) {
		let preset = resolution_presets[key];
		container.innerHTML += "<div class='button' onclick='setResolution(" + preset.x + ", " + preset.y + ");'>" + key + "</div>";
	}
}

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

function get_required_screen(width, height) {
	if (width <= resolution_presets.T1.x && height <= resolution_presets.T1.y)
		return "T1";
	else if (width <= resolution_presets.T2.x && height <= resolution_presets.T2.y)
		return "T2";
	else if (width <= resolution_presets.T3.x && height <= resolution_presets.T3.y)
		return "T3";
	return "unknown";
}

function setScreenSize(width, height) {
	if (width > maxScreenWidth) {
		set_err("Cannot exceed max screen width (" + maxScreenWidth + ")");
		return;
	} else if (height > maxScreenHeight) {
		set_err("Cannot exceed max screen height (" + maxScreenHeight + ")");
		return;
	}
	screenWidth = width;
	screenHeight = height;
	document.getElementById("block_width").value = width;
	document.getElementById("block_height").value = height;
	let screen = document.getElementById("screen");
	screen.style.width = width * blockWidth + "px";
	screen.style.height = height * blockHeight + "px";
	console.info(updateMonitorScale());
}

function setScreenSizeControl() {
	let width = document.getElementById("block_width").value;
	let height = document.getElementById("block_height").value;
	if (width > 0 && height > 0)
		setScreenSize(width, height);
	else
		set_err("Width and height must be greater than zero.");
}

function updateMonitorScale() {
	let monitorContainer = document.getElementById("monitor_container");
	let screenWidth = monitorContainer.clientWidth;
	let screenHeight = monitorContainer.clientHeight;

	let monitorWidth = width * 8;
	let monitorHeight = height * 16;

	let scale = {width: screenWidth / monitorWidth, height: screenHeight / monitorHeight};

	let offsetX = (screenWidth - monitorWidth) / 2;
	let offsetY = (screenHeight - monitorHeight) / 2;

	let monitor = document.getElementById("monitor");
	monitor.style.transform = "translate(" + offsetX + "px, " + offsetY + "px) scale(" + Math.min(scale.width, scale.height) + ")";
	monitor.style.width = monitorWidth + "px";
	return scale;
}