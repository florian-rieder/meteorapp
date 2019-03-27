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
		frequency: 15,
		singleChannel : true,
		locator: {
			halfSample: false,
  			patchSize: "large", // x-small, small, medium, large, x-large
  			debug: {
    			showCanvas: false,
    			showPatches: false,
   				showFoundPatches: false,
    			showSkeleton: false,
    			showLabels: false,
    			showPatchLabels: false,
    			showRemainingPatchLabels: false,
    			boxFromPatches: {
      				showTransformed: false,
      				showTransformedBox: false,
      				showBB: false
    			}
  			}
		},
		numOfWorkers: window.navigator.hardwareConcurrency,
		/* area: { // defines rectangle of the detection/localization area
			top: "10%",    // top offset
			right: "15%",  // right offset
			left: "15%",   // left offset
			bottom: "10%"  // bottom offset
		  }, */
		//Sets types of barcodes supported
		decoder: {
			readers: [
				// order matters, and do not add unnecessary readers
				"ean_reader",
				//"ean_8_reader",
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
	const samples = 15;

	Quagga.onDetected(function (result) {
		console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result.codeResult);

		results.push(result.codeResult);
		if (detectedBarCodes >= samples) {
			//if we scanned $samples bar codes, stop the scanner
			stopScanner();
			// get the most occuring result in the array (get its mode)
			const mostOccurringBarcode = mode(results);
			// use the most occurring barcode for stuff
			console.log('most occurring barcode: ' + mostOccurringBarcode);
			// ...
		} else {
			detectedBarCodes++;
		}

		function mode(array) {
			let processed = {};
			// for each result, we count the number of occurrences
			array.forEach(result => {
				// we use an object whose properties are the value of the result, that way we
				// can create a new property called `_${result}` (because we can't use numbers as variable names)
				// and we then count the number of occurrences of all results.
				if (processed[`_${result}`] === undefined) { // strict equality
					processed[`_${result}`] = 1;
				} else {
					processed[`_${result}`]++;
				}
			});

			/* //https://github.com/serratus/quaggaJS/issues/237
			var countDecodedCodes = 0, err = 0;
			$.each(result.codeResult.decodedCodes, function (id, error) {
				if (error.error != undefined) {
					countDecodedCodes++;
					err += parseFloat(error.error);
				}
			});
			if (err / countDecodedCodes < 0.1) {
				// correct code detected
			} else {
				// probably wrong code
			}
			//end  */

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
			return mode.slice(1);
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
