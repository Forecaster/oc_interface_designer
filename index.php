<?
//Created 05/03/2016

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>oc_interface_designer</title>
  <link rel="stylesheet" href="main.css"/>
  <script src="main.js"></script>
</head>
<body>
<div>The OpenComputers interface assistant!</div>
<div class="main-container">
  <div id="monitor" class="monitor" style=""></div>
  <div class="container msg_box" id="messages"></div>
</div>
<div class="main-container" style="width: 600px;">
  <div class="container">Controls:</div>
  <div class="container">
    <input type="number" id="res_width" placeholder="Width"/>
    <input type="number" id="res_height" placeholder="Height"/>
    <button onclick="SetResolutionControl()">Set Resolution</button>
  </div>
  <div class="container">
    <div class="container">Resolution Presets:</div>
    <div class="container" id="resolution_presets"></div>
  </div>
  <div class="container">
    <table>
      <TR><TD><label for="color_value">Web Hex:</label></TD><TD><input type="text" placeholder="Web Hex Value" id="color_value"/></TD></TR>
      <TR><TD><label for="color_value_computronics">Lua Hex:</label></TD><TD><input type="text" placeholder="Lua Hex Value" id="color_value_computronics"/></TD></TR>
    </table>
    <div>
      <label><input type="radio" name="background_foreground_switch" onclick="setBackgroundTarget();" checked/> Background</label>
      <label><input type="radio" name="background_foreground_switch" onclick="setForegroundTarget();"/> Foreground (Text)</label>
    </div>
  </div>
  <div class="container">Click a created shape to show controls</div>
  <div class="container" id="shape_controls" style="display: none;">
    <div>Shape Controls</div>
    <div>
      <button onclick="delete_shape(selected_shape_id)">Delete Shape</button>
    </div>
    <div>This code draws the selected shape:</div>
    <div><textarea title="Fill Code" id="fill_code" readonly="readonly" style="width: 400px;"></textarea></div>
    <div>This statement tests for clicks within the area:</div>
    <div><textarea title="Event conditions" id="pull_code" readonly="readonly" style="width: 400px; height: 4em;"></textarea></div>
  </div>
  <div id="current_colors">Current Colors</div>
  <div class="container" style="margin-top: 10px;" id="color_picker">
  </div>
</div>
<div class="main-container" style="width: 700px;">
  <p>
    Hi! This is a prorotype currently, so beware of bugs! Go to my <a href="http://towerofawesome.org/forum/forumdisplay.php?fid=58">forum</a>, join #oc on <a href="http://esper.net">esper.net</a> or <a href="https://discord.gg/0hVukoQ2KYifZFCA">OpenComputers discord server</a> and poke Forecaster to get help, report bugs or provide suggestions!
  </p>
  <p>
    This application is for assisting with creating graphical interfaces for OpenComputers programs, something that I've always found slightly intimidating because it requires dealing with coordinates and stuff. Which means lots of numbers to keep track of.
  </p>
  <p>
    But with this you can graphically draw your buttons and boxes and get the code required to draw them with your program and to test for click events for them!
  </p>
  <p>
    Usage:<br/>
    1. Select the resolution preset you need, or set a custom one<br/>
    2. Select two points on the screen to create a shape<br/>
    3. Click the created shape to show fill code and click event condition for this shape<br/>
    4. Create as many shapes as you need
  </p>
</div>
</body>

<script>
  var width = 160;
  var height = 50;

  var pixelWidth = 8;
  var pixelHeight = 16;

  var target = "background";
  var background = "red";
  var foreground = "white";

  var shapes = [];
  var shape_data = [];

  var selected_shape_id = null;

  var selectAposX = null;
  var selectAposY = null;
  var selectBposX = null;
  var selectBposY = null;

  var colors = {
    rows: ["00", "33", "66", "99", "CC", "FF"],
    blocks: ["00", "24", "49", "6D", "92", "B6", "DB", "FF"],
    columns: ["00", "40", "80", "C0", "FF"],
    grays: ["0F", "1E", "2D", "4B", "5A", "69", "78", "87", "96", "A5", "B4", "C3", "D2", "E1", "F0"]
  };

  var max_resolution_area = 8000;

  var resolution_presets = {};
  resolution_presets["T1"] = {x: 50, y: 16};
  resolution_presets["T2"] = {x: 80, y: 25};
  resolution_presets["T3"] = {x: 160, y: 50};
  resolution_presets["Tablet"] = {x: 80, y: 25};

  setResolution(resolution_presets.T1.x, resolution_presets.T1.y);
  generate_preset_buttons();
  generate_color_picker();
  update_current_colors();
</script>

</html>