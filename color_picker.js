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

function pick_color(element) {
	document.getElementById("color_value").value = "#" + element.title;
	document.getElementById("color_value_computronics").value = "0x" + element.title;
	update_current_colors("#" + element.title);
}

function update_current_colors(color) {
	document.getElementById("current_color").style.backgroundColor = color;
}