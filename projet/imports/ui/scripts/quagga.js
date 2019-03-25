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
				"i2of5_reader"
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
			document.getElementById("scannerContainer").outerHTML = ""; //removes frozen video window
		} else {
			startScanner();
		}
		console.log('quagga running: ' +scannerIsRunning);
	}
})
