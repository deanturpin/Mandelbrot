"use strict"

// Start animation
function draw(width, height) {

	function mandelbrot(iterations) {

		clear()

		// Test if a point is in the Mandelbrot set
		function member(e, zr, zi, cr, ci) {

			// Check if we're outside the set
			if ((zr*zr + zi*zi) > 4)
				return e

			// Otherwise keep going
			if (e > 0) {

				const zr2 = zr * zr + zi * zi * -1 + cr
				const zi2 = zi * zr + zr * zi + ci

				return member(e - 1, zr2, zi2, cr, ci)
			}

			// Point is in the set
			return e
		}

		const grid = height / 2.6
		const resolution = .02

		const iMin = -2.1
		const iMax = .8
		const jMin = -1.3
		const jMax = 1.3

		// Print the points within the set
		for (var i = iMin; i < iMax; i += resolution)
			for (var j = jMin; j < jMax; j += resolution) {
		
				// Check if this point is a member
				const e = member(iterations, i, j, i, j)

				// Draw a point using the iterations before exiting the set as the colour
				circle(
					(i - iMin) * grid,
					(j - jMin) * grid,
					resolution * grid / 1.5,
					Math.round(e * 255 / iterations), // red
					0, // green
					0 // blue
					)
				}
	}

	const iterations = 30

	// Draw frames
	function frames(i) {

		if (i < iterations) {

			clear()

			// Draw the set
			console.log("iteration", i)
			mandelbrot(i)

			// Schedule the next frame
			setTimeout(frames, 1, i + 1)
		}
	}

	// Draw the first frame
	frames(0)
}
