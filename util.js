//<editor-fold desc="https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb">
function componentToHex(c) {
	let hex = parseInt(c).toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
//</editor-fold>

function convertColorValueToHex(color) {
	return color.toString().replace("0x", "#");
}

function convertColorValueToDec(color) {
	return color.toString().replace("#", "0x");
}