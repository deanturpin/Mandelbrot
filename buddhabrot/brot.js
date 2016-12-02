"use strict"

onload = function() {

	// Create a canvas element
	var canvas = document.createElement("canvas")
	var body = document.getElementsByTagName("body")[0]

	// Add it to the DOM
	body.appendChild(canvas)

	// Define canvas (view port)
	var context = canvas.getContext("2d")

	// Set canvas size
	const width = window.innerWidth
	const height = window.innerHeight
	canvas.width = width
	canvas.height = height

	// View port
	var zoom = height/4

	// Search depth
	var iterations = 15

	// Start position in the view port
	var xOffset = width/2
	var yOffset = height/2

	function getMousePos(canvas, evt) {

		var rect = canvas.getBoundingClientRect()

		return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
		}
	}

	canvas.addEventListener("click", function(evt) {

		var mousePos = getMousePos(canvas, evt);

		// Update view port
		zoom = zoom * 1.3
		iterations = iterations + .2

		xOffset = xOffset + width/2 - mousePos.x
		yOffset = yOffset + height/2 - mousePos.y

		// Render
		requestAnimationFrame(brot)
	}, false);

	// Toggle between 'brots
	const mandy = false

	// Draw the 'brot
	function brot() {

		// Create bitmap
		var bitmap = new Array(width)

		for (var x = 0; x < width; ++x)
			bitmap[x] = new Array(height)

		// Initialise bitmap
		for (var x = 0; x < width; ++x)
			for (var y = 0; y < height; ++y)
				bitmap[x][y] = 0

		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height)

		// Complex number class
		function complex() {

			// Real and imaginary
			this.r
			this.i
		}

		// Test if point is a member of the set
		function calculateExitPath(zr, zi, iterations) {

			var path = []

			var cr = zr
			var ci = zi

			for (var i = 0; i < iterations; ++i) {

				// Add point to path
				var p = new complex()
				p.r = zr
				p.i = zi
				path[path.length] = p

				// Don't look any further if we've escaped the set
				// Return path so far
				if ((zr * zr + zi * zi) > 4)
					return path

				// Calculate next point
				const zr2 = (zr * zr) + (zi * zi * -1) + cr
				const zi2 = (zi * zr) + (zr * zi) + ci

				// Copy the latest
				zr = zr2
				zi = zi2
			}

			// Return an empty array if we're in the set
			return []
		}

		// Test if each element in the bitmap is a member of the set
		for (var x = 0; x < width; ++x)
			for (var y = 0; y < height; ++y) {

				const path = calculateExitPath(
					(x - xOffset) / zoom,
					(y - yOffset) / zoom,
					iterations)

				if (mandy) {

					// Mandelbrot
					// Populate the bitmap with the length of escape path
					if (path.length)
						bitmap[x][y] = path.length
				}
				else {

					// Buddhabrot
					// Increment each pixel as the escape path crosses it
					if (path.length)
						for (var p = 0; p < path.length; ++p) {
						
							// Convert path to view port units
							var point = path[p]
							point.r += xOffset / zoom
							point.i += yOffset / zoom
							point.r *= zoom
							point.i *= zoom

							point.r = Math.round(point.r)
							point.i = Math.round(point.i)

							// Increment the bitmap for each point in the path
							if (point.r < width && point.i < height
								&& point.r >=0 && point.i >= 0)
								++bitmap[point.r][point.i]
						}
				}
			}

		// Calculate max intensity
		var maxIntensity = 0
		for (var x = 0; x < width; ++x)
			for (var y = 0; y < height; ++y)
				if (bitmap[x][y] > maxIntensity)
					maxIntensity = bitmap[x][y]

		// Display 'brot
		for (var x = 0; x < width; ++x)
			for (var y = 0; y < height; ++y) {

				const s = Math.floor((bitmap[x][y] * 256)/maxIntensity) 
				context.fillStyle = "rgb(" + s + ", " + s + ", " + s + ")"
				context.fillRect(x, y, 1, 1)
			}
	}

	// Render first frame
	requestAnimationFrame(brot)
}
