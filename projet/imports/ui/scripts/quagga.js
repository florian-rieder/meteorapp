import Quagga from "quagga"
import '../templates/quagScan.html'

//Flag for scanner status
let scannerIsRunning = false;

function startScanner() {
	//initialization of scanner config
	Quagga.init({
		inputStream: {
			name: "Live",
			type: "LiveStream",
			target: document.querySelector('#scannerContainer'),
			constraints: {
				width: 480,
				height: 320,
			},
		},
		//Sets types of barcodes supported
		decoder: {
			readers: [
				"code_128_reader",
				"ean_reader",
				"ean_8_reader",
				"code_39_reader",
				"code_39_vin_reader",
				"codabar_reader",
				"upc_reader",
				"upc_e_reader",
				"i2of5_reader",
			],
		},
	},
		function (err) {
			if (err) {
				console.error(err);
				return
			}

			console.log("Initialization finished. Ready to start");
			Quagga.start();

			// Set flag to is running
			scannerIsRunning = true;
		});

	Quagga.onProcessed(function (result) {
		//sets context and canvas for quagga overlay
		var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;

		//Draws box around codebar for visual feedback of scanner, different visual feedback depending on result type
		if (result) {
			//General detection of barcode
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
				});
			}
			//precise detection of barcode
			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
			}
			//Red line indicating full detection process
			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
			}
		}
	});

	let results = [];
	let detectedBarCodes = 0;
	const samples = 25;

	Quagga.onDetected(function (result) {
		console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);

		results.push(result.codeResult.code);
		if (detectedBarCodes >= samples) {
			//if we scanned $samples bar codes, stop the scanner
			stopScanner();
			// get the most occuring result in the array (get its mode)
			const mostOccurringBarcode = mode(results);
			// use the most occurring barcode for stuff
			// ...
		} else {
			detectedBarCodes++;
		}

		function mode(array) {
			let processed = {};
			// for each result, we count the number of occurrences
			results.forEach(result => {
				// we use an object whose properties are the value of the result, that way we
				// can create a new property called `_${result}` (because we can't use numbers as variable names)
				// and we then count the number of occurrences of all results.
				if (processed[`_${result}`] === undefined) { // strict equality
					processed[`_${result}`] = 1;
				} else {
					processed[`_${result}`]++;
				}
			});
			//get the property name with the highest count
			const mode = Object.getOwnPropertyNames(processed).reduce((mode, code) => {
				//mode is the barcode that has (will have) the highest occurrence
				//code is the different barcodes quagga has found

				//if the value of processed.mode is inferior to the value of processed.code
				if (processed[mode] < processed[code]) {
					return code; // assign code to mode
				} else {
					return mode; // do nothing
				}
			});
			return mode;
		}
	});
}

function stopScanner() {
	Quagga.stop();
	scannerIsRunning = false;
	document.getElementById("scannerContainer").innerHTML = ""; //removes frozen video window
}

// Start/stop scanner

Template.quagScan.events({
	'click #scan_btn'() {
		if (scannerIsRunning) {
			stopScanner();
		} else {
			startScanner();
		}
		console.log('quagga running: ' + scannerIsRunning);
	}
})
