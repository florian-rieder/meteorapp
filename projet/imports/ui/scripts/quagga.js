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
	}, function (err) {
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
		//Determines context and canvas from quagga overlay
		var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;
		

		
		if (result) {
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
				});
			}

			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
			}

			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
			}
		}
	});



		
	Quagga.onDetected(function (result) {
		console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
	});
}

// Start/stop scanner

Template.quagScan.events({
	'click #scan_btn'() {
		if (scannerIsRunning) {
			Quagga.stop();
			scannerIsRunning = false;
			document.getElementById("scannerContainer").innerHTML = ""; //removes frozen video window
		} else {
			startScanner();
		}
		console.log('quagga running: ' +scannerIsRunning);
	}
})
