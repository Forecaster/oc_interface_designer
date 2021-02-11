function setResolution(w, h) {
	width = w;
	height = h;
	if ((width * height) > max_resolution_area) {
		set_err("Cannot exceed max resolution area (" + max_resolution_area + ")");
		return;
	}
	console.log("Setting resolution to " + width + "x" + height);

	let monitor = document.getElementById("monitor");

	monitor.innerHTML = "";
	pixel_container = document.createElement("div");
	pixel_container.id = "pixel_container";
	pixel_container.className = "pixel_container";
	monitor.appendChild(pixel_container);
	shape_container = document.createElement("div");
	shape_container.id = "shape_container";
	shape_container.className = "shape_container";
	monitor.appendChild(shape_container);
	selector_shape_container = document.createElement("div");
	selector_shape_container.id = "selector_shape_container";
	selector_shape_container.className = "shape_container";
	monitor.appendChild(selector_shape_container);
	pixel_select_container = document.createElement("div");
	pixel_select_container.id = "pixel_select_container";
	pixel_select_container.className = "pixel_select_container";
	monitor.appendChild(pixel_select_container);

	for (let i = 1; i <= h; i++) {
		let row_div_dis = document.createElement("div");
		let row_div_sel = document.createElement("div");
		row_div_dis.className = "row";
		row_div_sel.className = "row";

		let div_dis = document.createElement("div");
		let div_sel = document.createElement("div");
		for (let x = 1; x <= w; x++) {
			div_dis = document.createElement("div");
			div_dis.className = "pixel display_pixel";
			div_dis.id = x + "," + i;
			div_dis.innerHTML = "<div class='pixel_content'></div>";
			row_div_dis.appendChild(div_dis);

			div_sel = document.createElement("div");
			div_sel.className = "pixel select_pixel";
			div_sel.setAttribute("data-x", x.toString());
			div_sel.setAttribute("data-y", i.toString());
			div_sel.title = x + "," + i;
			div_sel.onclick = shapeSelectorStartStop;
			div_sel.onmouseover = shapeSelectorMove;
			row_div_sel.appendChild(div_sel);
		}
		pixel_container.appendChild(row_div_dis);
		pixel_select_container.appendChild(row_div_sel);
	}
	document.getElementById("res_width").value = width;
	document.getElementById("res_height").value = height;
	console.info(updateMonitorScale());
}

function getResolution() {
	return { width: document.getElementById("res_width").value, height:	document.getElementById("res_height").value };
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

function setContentAt(x, y, content) {
	content = content.substring(0, 1);
	if (typeof pixel_container.children[y -1] === "undefined") {
		console.warn("Attempt to set off-screen pixel at " + x + ", " + y);
		return;
	}
	if (typeof pixel_container.children[y -1].children[x -1] === "undefined") {
		console.warn("Attempt to set off-screen pixel at " + x + ", " + y);
		return;
	}
	let target = pixel_container.children[y - 1].children[x -1];
	target.children[0].innerText = content;
	target.style.backgroundColor = background;
	target.style.color = foreground;
}

function getContentAt(x, y) {
	let content = pixel_container.children[y - 1].children[x -1].children[0].innerText;
	if (content === "")
		return " ";
	return content;
}

function setBackgroundAt(x, y, color) {
	pixel_container.children[y - 1].children[x -1].style.backgroundColor = color;
}

function getBackgroundAt(x, y) {
	let value = pixel_container.children[y - 1].children[x -1].style.backgroundColor;
	value = value.replace("rgb(", "").replace(")", "").split(", ");
	return rgbToHex(value[0], value[1], value[2]).toUpperCase();
}

function setForegroundAt(x, y, color) {
	pixel_container.children[y - 1].children[x -1].style.color = color;
}

function getForegroundAt(x, y) {
	let value = pixel_container.children[y - 1].children[x -1].style.color;
	value = value.replace("rgb(", "").replace(")", "").split(", ");
	return rgbToHex(value[0], value[1], value[2]).toUpperCase();
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