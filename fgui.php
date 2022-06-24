<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>OpenComputers Interface Designer</title>
		<link rel="stylesheet" href="main.css"/>
	</head>
	<body>
		<h2>FGUI Library</h2>
		<p>The FGUI library is a small library created by Forecaster for handling drawing and using on-screen buttons. It also has a method for drawing text centered on the screen.</p>
		<p>The following methods are in this library:</p>
		<ul>
			<li><code>createButton(id: string, text: string, background_color: number, x1: number, y1: number, x2: number, y2: number)</code><br/>Creates and draws a button between the desired coordinates and adds it to the internal button list.</li>
			<li><code>clearButton(id: string)</code><br/>Removes the button from the button list and fills the space it occupied with black pixels.</li>
			<li><code>testButton(x: number, y: number)</code><br/>Tests if the given coordinates are within the boundaries of a button. Returns the first matching id.</li>
			<li><code>exampleOnTouch(name: string, screen: address, x: number, y: number, button: number, player: string)</code><br/>An example of a callback function for the touch event.</li>
			<li><code>writeTextCentered(text: string, line: number, color: number, background_color: number)</code><br/>Writes the given text centered on the given line relative to the current resolution.</li>
		</ul>
		<p>You can view the actual lua code by clicking <a href="fgui.lua">here</a>. Right-click on the link to save the file, or open and copy-paste the code into Minecraft.</p>
	</body>
</html>