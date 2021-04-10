oc = {
	gpu: {
		bind: function(address, reset) {},
		getScreen: function() {},
		getBackground: function() {
			return background;
		},
		setBackground: function(color, isPaletteIndex) {
			let default_bg = background.toString();
			background = convertColorValueToHex(color);
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
			let data = getResolution();
			return [ data.width, data.height ];
		},
		setResolution: function(width, height) {
			setResolution(getFirstMonitor(), width, height);
		},
		getViewport: function() {},
		setViewport: function() {},
		get: function(x, y) {
			let content = getFirstMonitor().pixel_container.children[y -1].children[x -1].innerText;
			if (content === "")
				return " ";
			return [getContentAt(getFirstMonitor(), x, y), getForegroundAt(getFirstMonitor(), x, y), getBackgroundAt(getFirstMonitor(), x, y)];
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
					setContentAt(getFirstMonitor(), x, pos, value[counter]);
				else
					setContentAt(getFirstMonitor(), pos, y, value[counter]);
				counter++;
			}
			return true;
		},
		copy: function(x, y, width, height, tx, ty) {
			let content = {};
			for (let posx = x; posx < x + width; posx++) {
				for (let posy = y; posy < y + height; posy++) {
					if (typeof content[posy] == "undefined")
						content[posy] = {};
					content[posy][posx] = { content: getContentAt(getFirstMonitor(), x, y), background: getBackgroundAt(getFirstMonitor(), x, y), foreground: getForegroundAt(getFirstMonitor(), x, y) };
				}
			}
			let cx = tx;
			let cy = ty;
			for (let posy in content) {
				let line = content[posy];
				for (let posx in line) {
					let pixel = line[posx];
					setContentAt(getFirstMonitor(), cx, cy, pixel.content);
					setBackgroundAt(getFirstMonitor(), cx, cy, pixel.background);
					setForegroundAt(getFirstMonitor(), cx, cy, pixel.foreground);
					cx++;
				}
				cx = tx;
				cy++;
			}
			return true;
		},
		fill: function(x, y, width, height, char) {
			for (let posx = x; posx < x + width; posx++) {
				for (let posy = y; posy < y + height; posy++) {
					setContentAt(getFirstMonitor(), posx, posy, char);
				}
			}
			return true;
		}
	},
	fgui: {
		buttons: {},
		createButton: function(id, text, x, y, w, h) {
			oc.gpu.fill(x, y, w, h, " ");
			this.writeTextCentered(text, y + Math.floor(height / 2), "0xFFFFFF");
			this.buttons[id] = { x: x, y: y, w: w, h: h };
		},
		clearButton: function(id) {
			if (this.buttons[id]) {
				let button = this.buttons[id];
				oc.gpu.fill(button.x, button.y, button.w, button.h, " ");
			}
		},
		testButton: function(x, y) {
			for (let id in this.buttons) {
				let button = this.buttons[id];
				if (x >= button.x && x <= button.x + button.w && y >= button.y && y <= button.y + button.h) {
					return id
				}
			}
			return null;
		},
		writeTextCentered: function(text, x, y, w, h, preserve_background_color) {
			let fg_default = oc.gpu.getForeground();
			let bg_default = oc.gpu.getBackground();
			let line = y + Math.floor(h / 2);

			if (preserve_background_color === null)
				preserve_background_color = false;
			let starting_position = x + (w / 2) - Math.floor(text.length / 2) -1;
			let posY = line;
			if (preserve_background_color) {
				let char_counter = 0;
				for (let posX = starting_position; posX < (starting_position + text.length); posX++) {
					let background = getBackgroundAt(getFirstMonitor(), posX, posY);
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