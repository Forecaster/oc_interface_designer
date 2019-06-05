
function SetResolutionControl()
{
  var width = document.getElementById("res_width").value;
  var height = document.getElementById("res_height").value;
  if (width > 0 && height > 0)
    setResolution(width, height);
}

function setResolution(w, h)
{
  width = w;
  height = h;
  if ((width * height) > max_resolution_area)
  {
    set_err("Cannot exceed max resolution area (" + max_resolution_area + ")");
    return;
  }
  console.log("Setting resolution to " + width + "x" + height);

  var monitor = document.getElementById("monitor");
  monitor.innerHTML = "";

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

  for (var i = 1; i < h; i++)
  {
    var row_div = document.createElement("div");
    row_div.className = "row";

    var div = document.createElement("div");
    // div.className = "coordinate";
    // div.innerHTML = i;
    // div.style.width = "1em";
    // row_div.appendChild(div);
    for (var x = 1; x < w; x++)
    {
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
}

function setBackground(hex)
{
  background = "#" + hex;
  update_current_colors();
}

function setForeground(hex)
{
  foreground = "#" + hex;
  update_current_colors();
}

function fill(xA, yA, xB, yB, char)
{
  var ypos = 0;
  var xpos = 0;
  var rows = 0;
  var pixels = 0;
  if (typeof char == "undefined" || char == null)
    char = " ";
  console.log("Filling from " + xA + ", " + yA + " to " + xB + ", " + yB + " (" + char + ")");
  console.log("Starting loop between row " + yA + " and row " + yB);
  console.log(yA + " <= " + yB + ": " + (yA <= yB));
  for (ypos = yA; ypos <= yB; ypos++)
  {
    rows++;
    console.log("Starting loop between column " + xA + " and column " + xB);
    for (xpos = xA; xpos <= xB; xpos++)
    {
      pixels++;
      console.log("Getting pixel at " + xpos + ", " + ypos);
      var pixel = document.getElementById(xpos + "," + ypos);
      if (pixel != null)
      {
        console.log("Setting pixel at " + xpos + ", " + ypos);
        pixel.style.backgroundColor = background;
        pixel.style.color = foreground;
        pixel.innerHTML = char;
      }
      else
        console.error("Tried to get pixel at " + xpos + ", " + ypos + " that does not exist");
    }
  }
  console.log("Modified " + rows + " rows");
  console.log("Modified " + pixels + " pixels");
}

function fillSelection(event)
{
  var positions = event.target.id.split(",");
  if (selectAposX == null)
  {
    event.target.style.backgroundColor = "yellow";
    console.log("Selected position A at " + positions[0] + ", " + positions[1]);
    selectAposX = parseInt(positions[0]);
    selectAposY = parseInt(positions[1]);
  }
  else
  {
    document.getElementById(selectAposX + "," + selectAposY).style.backgroundColor = null;
    console.log("Selected position B at " + positions[0] + ", " + positions[1]);
    selectBposX = parseInt(positions[0]);
    selectBposY = parseInt(positions[1]);
    shapeButton();
  }
}

function shapeButton()
{
  var w = 0;
  var x = 0;
  if (selectAposX < selectBposX)
  {
    x = selectAposX;
    w = selectBposX - selectAposX;
  }
  else
  {
    x = selectBposX;
    w = selectAposX - selectBposX;
  }
  var h = 0;
  var y = 0;
  if (selectAposY < selectBposY)
  {
    y = selectAposY;
    h = selectBposY - selectAposY;
  }
  else
  {
    y = selectBposY;
    h = selectAposY - selectBposY;
  }
  createShape(x, y, w, h);
  clear_selection();
}

function clear_selection()
{
  selectAposX = null;
  selectAposY = null;
  selectBposX = null;
  selectBposY = null;
}

function createShape(x, y, w, h)
{
  x--;
  y--;
  w++;
  h++;
  var monitor = document.getElementById("monitor");
  var div = document.createElement("div");
  var id = shapes.length;
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

  monitor.appendChild(div);
  shapes.push(div);
  return true;
}

function manage_shape(event)
{
  selected_shape_id = event.target.getAttribute("data-id");
  var shape = shapes[selected_shape_id];
  var x = parseInt(shape.getAttribute("data-x")) + 1;
  var y = parseInt(shape.getAttribute("data-y")) + 1;
  var w = parseInt(shape.getAttribute("data-width"));
  var h = parseInt(shape.getAttribute("data-height"));
  var fill_code = "gpu.fill(" + x + "," + y + "," + w + "," + h + ",\" \")";
  var pull_code = "if x >= " + x + " and x <= " + (x + (w - 1)) + " and y >= " + y + " and y <= " + (y + (h - 1)) + " then\n  --put your onclick code here\nend";
  document.getElementById("fill_code").value = fill_code;
  document.getElementById("pull_code").value = pull_code;
  document.getElementById("shape_controls").style.display = null;
}

function delete_shape(id)
{
  var monitor = document.getElementById("monitor");
  var shape = shapes[id];
  shapes[id] = null;
  monitor.removeChild(shape);
  document.getElementById("shape_controls").style.display = "none";
}

function generate_color_picker()
{
  var row_key = "";
  var blo_key = "";
  var col_key = "";
  var container = "";
  for (var i = 0; i < colors.rows.length; i++)
  {
    row_key = colors.rows[i];
    container += "<div class=\"color-row\">";
    for (var a = 0; a < colors.blocks.length; a++)
    {
      blo_key = colors.blocks[a];
      for (var b = 0; b < colors.columns.length; b++)
      {
        col_key = colors.columns[b];
        container += "<div onclick=\"pick_color(this);\" title=\"" + row_key + blo_key + col_key + "\" style=\"background-color: #" + row_key + blo_key + col_key + ";\" class=\"color-cube\"></div>";
      }
    }
    container += "</div>";
  }

  container += "<div class=\"color-row\">";
  for (var t = 0; t < colors.grays.length; t++)
  {
    var key = colors.grays[t];
    container += "<div onclick=\"pick_color(this);\" title=\"" + key + key + key + "\" style=\"background-color: #" + key + key + key + ";\" class=\"color-cube\"></div>";
  }
  container += "</div>";

  document.getElementById("color_picker").innerHTML = container;
}

function setForegroundTarget()
{
  target = "foreground";
}

function setBackgroundTarget()
{
  target = "background";
}

function pick_color(element)
{
  document.getElementById("color_value").value = "#" + element.title;
  document.getElementById("color_value_computronics").value = "0x" + element.title;

  console.log(element.title);
  if (target == "background")
    setBackground(element.title);
  else
    setForeground(element.title);
}

function update_current_colors()
{
  console.log("Update current color display");
  console.log(background);
  var elem = document.getElementById("current_colors");
  elem.style.backgroundColor = background;
  elem.style.color = foreground;
}

function generate_preset_buttons()
{
  var container = document.getElementById("resolution_presets");

  container.innerHTMl = "";

  for (var key in resolution_presets)
  {
    var preset = resolution_presets[key];
    container.innerHTML += "<div class='button' onclick='setResolution(" + preset.x + ", " + preset.y + ");'>" + key + "</div>";
  }
}

function set_msg(msg)
{
  var container = document.getElementById("messages");
  container.style.color = "white";
  container.innerHTML = msg;
}

function set_err(msg)
{
  var container = document.getElementById("messages");
  container.style.color = "orange";
  container.innerHTML = msg;
}
