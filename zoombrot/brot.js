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

	var zoom = 100
	const iterations = 25
	canvas.width = width
	canvas.height = height

	// Create bitmap
	var bitmap = new Array(width)

	for (var x = 0; x < width; ++x)
		bitmap[x] = new Array(height)

	// Initialise bitmap
	for (var x = 0; x < width; ++x)
		for (var y = 0; y < height; ++y)
			bitmap[x][y] = 0

	// Draw the 'brot
	function brot() {

		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height)

		// Test if point is a member of the set
		function member(zr, zi, iterations) {

			var cr = zr
			var ci = zi

			for (var i = 0; i < iterations; ++i) {

				// Don't look any further if we've escaped the set
				if ((zr * zr + zi * zi) > 4)
					return iterations - i

				// Calculate next point
				const zr2 = (zr * zr) + (zi * zi * -1) + cr
				const zi2 = (zi * zr) + (zr * zi) + ci

				// Copy the latest
				zr = zr2
				zi = zi2
			}

			return 0
		}

		// Test if each element in the bitmap is a member of the set
		for (var x = 0; x < width; ++x)
			for (var y = 0; y < height; ++y)
				bitmap[x][y] = member(
					(x - 1.99 * zoom) / zoom,
					(y - height / 2) / zoom,
					iterations)

		// Display 'brot
		for (var x = 0; x < width; ++x)
			for (var y = 0; y < height; ++y)
				if (bitmap[x][y] === 0) {

					context.fillStyle = "#f00"
					context.fillRect(x, y, 1, 1)
				}
	}

	var count = 0
	const timer = setInterval(function() {

		if (++count > 350)
			clearInterval(timer)

		console.log(count)

		brot()
		zoom *= 1.05

	}, 1)
}
