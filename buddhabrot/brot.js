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
	const width = 24 // window.innerWidth
	const height = 24 // window.innerHeight

	var zoom = 150
	const iterations = 3
	canvas.width = width
	canvas.height = height

	// console.log = function() {}

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

		var maxIterations = 0

		// Complex number class
		function complex() {

			// Real and imaginary
			this.r
			this.i

			// Debug
			this.print = function() { console.log(this.r, this.i) }

			this.multiply = function(m) {

				var p = new complex()
				p.r *= m
				p.i *= m

				return p
			}
		}

		// Test if point is a member of the set
		function calculateExitPath(zr, zi, iterations) {

			var path = []

			var cr = zr
			var ci = zi

			// Begin path
			var p = new complex()
			p.r = zr
			p.i = zi

			path[path.length] = p

			for (var i = 0; i < iterations; ++i) {

				// Don't look any further if we've escaped the set
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
					x/zoom - 2,
					(y - height/2) / zoom,
					iterations)

				// console.log(path.length)

				if (path.length > 0)
					for (var p = 0; p < path.length; ++p) {
						
						var point = path[p]
						point.multiply(zoom)
						point.r += 2

						point.r = Math.round(point.r)
						point.i = Math.round(point.i)

						// point.print()

						if (point.r < width && point.i < height
							&& point.r >=0 && point.i >= 0) {

							++bitmap[point.r][point.i]
							// console.log("add", point.r, point.i, bitmap[point.r][point.i])
						}
						// else
							// console.log("off screen", point.r, point.i)
					}
			}

		// Calculate max intensity
		var maxIntensity = 0
		for (var x = 0; x < width; ++x)
			for (var y = 0; y < height; ++y) {

				// console.log("find max", x, y, bitmap[x][y], maxIntensity)

				if (bitmap[x][y] > maxIntensity) {

					maxIntensity = bitmap[x][y]
					// console.log("bigger", maxIntensity)
				}
			}

		console.log("max intensity", maxIntensity)

		// Display 'brot
		for (var x = 0; x < width; ++x) {

			console.log(bitmap[x])

			for (var y = 0; y < height; ++y) {

				// console.log("display", x, y, bitmap[x][y])

				if(bitmap[x][y] > 0) {

					const s = Math.floor((bitmap[x][y]) * 256/maxIntensity) 

					context.fillStyle = "rgb(" + s + ", " + s + ", " + s + ")"
					// context.fillStyle = "white"
					context.fillRect(x, y, 1, 1)
				}
				else {

					context.fillStyle = "red"
					context.fillRect(x, y, 1, 1)
				}
			}
		}
	}

	var count = 0
	function render() {

		if (count < 1) {

			requestAnimationFrame(render)

			brot()
			zoom *= 1.05
			++count
		}
	}

	// Start animation
	render()
}
