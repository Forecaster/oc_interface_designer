oc = {
	gpu: {
		bind: function(address, reset) {},
		getScreen: function() {},
		getBackground: function() {
			return background;
		},
		setBackground: function(color, isPaletteIndex) {
			let default_bg = background.toString();
			console.info(color);
			background = convertColorValueToHex(color.toString());
			console.info(background);
			return convertColorValueToDec(default_bg);
		},
		getForeground: function() {
			return foreground;
		},
		setForeground: function(color, isPaletteIndex) {
			let default_fg = foreground.toString();
			foreground = convertColorValueToHex(color);
			return convertColorValueToDec(default_fg);
		},
		getPaletteColor: function(index) {},
		setPaletteColor: function(index, value) {},
		maxDepth: function() {},
		setDepth: function(bit) {},
		maxResolution: function() {},
		getResolution: function() {
			return getResolution();
		},
		setResolution: function(width, height) {
			setResolution(width, height);
		},
		getViewport: function() {},
		setViewport: function() {},
		get: function(x, y) {
			let content = pixel_container.children[y -1].children[x -1].innerText;
			if (content === "")
				return " ";
			return [getContentAt(x, y), getForegroundAt(x, y), getBackgroundAt(x, y)];
		},
		set: function(x, y, value, vertical) {
			let start;
			if (vertical)
				start = y;
			else
				start = x;
			let counter = 0;
			for (let pos = start; counter < value.length; pos++) {
				if (vertical)
					setContentAt(x, pos, value[counter]);
				else
					setContentAt(pos, y, value[counter]);
				counter++;
			}
		},
		copy: function(x, y, width, height, tx, ty) {
			let content = {};
			for (let posx = x; posx < x + width; posx++) {
				for (let posy = y; posy < y + height; posy++) {
					if (typeof content[posy] == "undefined")
						content[posy] = {};
					content[posy][posx] = { content: getContentAt(x, y), background: getBackgroundAt(x, y), foreground: getForegroundAt(x, y) };
				}
			}
			let cx = tx;
			let cy = ty;
			for (let posy in content) {
				let line = content[posy];
				for (let posx in line) {
					let pixel = line[posx];
					setContentAt(cx, cy, pixel.content);
					setBackgroundAt(cx, cy, pixel.background);
					setForegroundAt(cx, cy, pixel.foreground);
					cx++;
				}
				cx = tx;
				cy++;
			}
		},
		fill: function(x, y, width, height, char) {
			for (let posx = x; posx < x + width; posx++) {
				for (let posy = y; posy < y + height; posy++) {
					setContentAt(posx, posy, char);
				}
			}
		}
	},
	fgui: {
		buttons: {},
		createButton: function(id, text, background_color, x1, y1, x2, y2) {
			let bg_default = oc.gpu.setBackground(background_color);
			let width = x2 - x1 + 1;
			let height = y2 - y1 + 1;
			oc.gpu.fill(x1, y1, width, height, " ");
			this.writeTextCentered(text, y1 + Math.floor(height / 2), "0xFFFFFF");
			oc.gpu.setBackground(bg_default);
			this.buttons[id] = { x1: x1, y1: y1, x2: x2, y2: y2 };
		},
		clearButton: function(id) {
			if (this.buttons[id]) {
				let button = this.buttons[id];
				let width = button.x2 - button.x1 + 1;
				let height = button.y2 - button.y1 + 1;
				oc.gpu.fill(button.x1, button.y1, width, height, " ");
			}
		},
		testButton: function(x, y) {
			for (let id in this.buttons) {
				let button = this.buttons[id];
				if (x >= button.x1 && x <= button.x2 && y >= button.y1 && y <= button.y2) {
					return id
				}
			}
			return null;
		},
		writeTextCentered: function(text, line, color, background_color) {
			let resolution = oc.gpu.getResolution();
			let width = resolution.width;
			let height = resolution.height;
			let fg_default = oc.gpu.getForeground();
			let bg_default = oc.gpu.getBackground();

			if (color)
				oc.gpu.setForeground(color);
			if (background_color && background_color !== "preserve")
				oc.gpu.setBackground(background_color);
			let starting_position = (width / 2) - Math.floor(text.length / 2) + 1;
			let posY = Math.min(height, line);
			if (background_color) {
				let char_counter = 0;
				for (let posX = starting_position; posX < (starting_position + text.length); posX++) {
					let background = getBackgroundAt(posX, posY);
					oc.gpu.setBackground(background);
					oc.gpu.set(posX, posY, text.substring(char_counter, char_counter));
					char_counter++;
				}
			} else {
				oc.gpu.set(starting_position, posY, text);
			}
			oc.gpu.setForeground(fg_default);
			oc.gpu.setBackground(bg_default);
		}
	}
}