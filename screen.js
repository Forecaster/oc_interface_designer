function createMonitor(element, w, h) {
	let id = Math.floor(Math.random() * 1000);
	console.info(id);
	if (typeof monitors[id] === "undefined") {
		element.innerHTML = "<div class=\"monitor_part monitor_top\"></div>" +
			"<div class=\"monitor_part monitor_bottom\"></div>" +
			"<div class=\"monitor_part monitor_left\"></div>" +
			"<div class=\"monitor_part monitor_right\"></div>" +
			"<div class=\"monitor_part monitor_top_left\"></div>" +
			"<div class=\"monitor_part monitor_top_right\"></div>" +
			"<div class=\"monitor_part monitor_bottom_left\"></div>" +
			"<div class=\"monitor_part monitor_bottom_right\"></div>"
		let screen_container = document.createElement("div");
		screen_container.id = "screen_container";
		screen_container.className = "screen_container";
		element.appendChild(screen_container);
		let screen = document.createElement("div");
		screen.id = "screen";
		screen.className = "screen";
		screen_container.appendChild(screen);
		let pixel_container = document.createElement("div");
		pixel_container.id = "pixel_container";
		screen.appendChild(pixel_container);
		let shape_container = document.createElement("div");
		shape_container.id = "shape_container";
		shape_container.className = "shape_container";
		screen.appendChild(shape_container);
		let selector_shape_container = document.createElement("div");
		selector_shape_container.id = "selector_shape_container";
		selector_shape_container.className = "shape_container";
		screen.appendChild(selector_shape_container);
		let pixel_select_container = document.createElement("div");
		pixel_select_container.id = "pixel_select_container";
		pixel_select_container.className = "pixel_select_container";
		screen.appendChild(pixel_select_container);
		let grid_container_columns = document.createElement("div");
		grid_container_columns.id = "grid_container_columns";
		grid_container_columns.className = "grid_columns";
		element.appendChild(grid_container_columns);
		let grid_container_rows = document.createElement("div");
		grid_container_rows.id = "grid_container_rows";
		grid_container_rows.className = "grid_rows";
		element.appendChild(grid_container_rows);
		let grid_coordinate_container_columns = document.createElement("div");
		grid_coordinate_container_columns.id = "grid_coordinate_container_columns";
		grid_coordinate_container_columns.className = "grid_coordinate_container_columns";
		element.appendChild(grid_coordinate_container_columns);
		let grid_coordinate_container_rows = document.createElement("div");
		grid_coordinate_container_rows.id = "grid_coordinate_container_rows";
		grid_coordinate_container_rows.className = "grid_coordinate_container_rows";
		element.appendChild(grid_coordinate_container_rows);

		for (let i = 0; i < w + 1; i++) {
			let col = document.createElement("div");
			col.className = "grid_column grid_border";
			grid_container_columns.appendChild(col);
			let coord = document.createElement("div");
			let num = (i + 1).toString();
			let pos = num * 8;
			if (num.length === 2)
				pos -= 4;
			else if (num.length === 3)
				pos -= 8;
			coord.innerText = num;
			coord.style.left = pos + "px";
			coord.style.display = "none";
			coord.id = "x" + num;
			coord.className = "grid_coordinate_column";
			grid_coordinate_container_columns.appendChild(coord);
		}

		for (let i = 0; i < h + 1; i++) {
			let row = document.createElement("div");
			row.className = "grid_row grid_border";
			grid_container_rows.appendChild(row);
			let coord = document.createElement("div");
			let num = (i + 1).toString();
			let pos = (num * 16) - 8;
			coord.innerText = num;
			coord.style.top = pos + "px";
			coord.style.display = "none";
			coord.id = "y" + num;
			coord.className = "grid_coordinate_row";
			grid_coordinate_container_rows.appendChild(coord);
		}

		// let posX = 16;
		// let posY = 16;
		// let ctx = grid_container.getContext("2d");
		// ctx.lineWidth = 1;
		// ctx.strokeStyle = "white";
		// ctx.moveTo(0, posY);
		// ctx.lineTo(100, posY);
		// ctx.stroke();

		let mon = { container: element, screen_container: screen_container, screen: screen, pixel_container: pixel_container, shape_container: shape_container, selector_shape_container: selector_shape_container, pixel_select_container: pixel_select_container, resolution: { w: w, h: h } };
		monitors[id] = mon;
		setResolution(mon, w, h);
	} else {
		createMonitor(element, w, h);
	}
}

function getFirstMonitor() {
	return monitors[Object.keys(monitors)[0]];
}

function setResolution(monitor, w, h) {
	width = w;
	height = h;
	if ((width * height) > max_resolution_area) {
		set_err("Cannot exceed max resolution area (" + max_resolution_area + ")");
		return;
	}
	console.log("Setting resolution to " + width + "x" + height);

	screen = monitor.screen_container;

	let pixel_container = monitor.pixel_container;
	pixel_container.innerHTML = "";
	let shape_container = monitor.shape_container;
	shape_container.innerHTML = "";
	let selector_shape_container = monitor.selector_shape_container;
	selector_shape_container.innerHTML = "";
	let pixel_select_container = monitor.pixel_select_container;
	pixel_select_container.innerHTML = "";

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
			div_sel.onmouseover = pixelSelectOnMouseOver;
			div_sel.onmouseout = pixelSelectOnMouseOut;
			row_div_sel.appendChild(div_sel);
		}
		pixel_container.appendChild(row_div_dis);
		pixel_select_container.appendChild(row_div_sel);
	}
	document.getElementById("res_width").value = width;
	document.getElementById("res_height").value = height;
	console.info(updateMonitorScale(monitor.screen_container));
}

function getResolution() {
	return { width: document.getElementById("res_width").value, height:	document.getElementById("res_height").value };
}

function setScreenSize(monitor, width, height) {
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
	monitor.container.style.width = width * blockWidth + "px";
	monitor.container.style.height = height * blockHeight + "px";
	console.info(updateMonitorScale(monitor.container));
}

function updateMonitorScale(monitor_container) {
	let screenWidth = monitor_container.clientWidth;
	let screenHeight = monitor_container.clientHeight;

	let monitorWidth = width * 8;
	let monitorHeight = height * 16;

	let scale = {width: screenWidth / monitorWidth, height: screenHeight / monitorHeight};

	let offsetX = (screenWidth - monitorWidth) / 2;
	let offsetY = (screenHeight - monitorHeight) / 2;

	monitor_container.style.transform = "translate(" + offsetX + "px, " + offsetY + "px) scale(" + Math.min(scale.width, scale.height) + ")";
	monitor_container.style.width = monitorWidth + "px";
	return scale;
}

function setContentAt(monitor, x, y, content) {
	content = content.substring(0, 1);
	if (typeof monitor.pixel_container.children[y -1] === "undefined") {
		console.warn("Attempt to set off-screen pixel at " + x + ", " + y);
		return;
	}
	if (typeof monitor.pixel_container.children[y -1].children[x -1] === "undefined") {
		console.warn("Attempt to set off-screen pixel at " + x + ", " + y);
		return;
	}
	let target = monitor.pixel_container.children[y - 1].children[x -1];
	target.children[0].innerText = content;
	target.style.backgroundColor = background;
	target.style.color = foreground;
}

function getContentAt(monitor, x, y) {
	let content = monitor.pixel_container.children[y - 1].children[x -1].children[0].innerText;
	if (content === "")
		return " ";
	return content;
}

function setBackgroundAt(monitor, x, y, color) {
	monitor.pixel_container.children[y - 1].children[x -1].style.backgroundColor = color;
}

function getBackgroundAt(monitor, x, y) {
	let value = monitor.pixel_container.children[y - 1].children[x -1].style.backgroundColor;
	value = value.replace("rgb(", "").replace(")", "").split(", ");
	return rgbToHex(value[0], value[1], value[2]).toUpperCase();
}

function setForegroundAt(monitor, x, y, color) {
	monitor.pixel_container.children[y - 1].children[x -1].style.color = color;
}

function getForegroundAt(monitor, x, y) {
	let value = monitor.pixel_container.children[y - 1].children[x -1].style.color;
	value = value.replace("rgb(", "").replace(")", "").split(", ");
	return rgbToHex(value[0], value[1], value[2]).toUpperCase();
}