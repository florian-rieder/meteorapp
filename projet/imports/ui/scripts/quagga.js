import Quagga from "quagga";
import { inspectDrugData, lastActivePage, LoadingWheel } from '../../api/utilities.js';
import '../templates/quagScan.html'
import '../templates/applicationLayout.html';
import Swal from "sweetalert2";


// Flag for scanner status
let scannerIsRunning = false;

export function startScanner() {
	// permissions check if mobile
	if (Meteor.isCordova) {
		var permissions = cordova.plugins.permissions;
		// check if the app has permission to use the camera
		// Fix for NotReadableError: video source, don't forget to add Camera Permissions in Android Manifest !!!
		permissions.checkPermission(permissions.CAMERA, function (status) {
			if (status.hasPermission) {
				console.log("camera permission allowed");
				start();
			}
			else {
				console.warn("camera permission not allowed");
				// if permission is not allowed, request permission to use the camera
				permissions.requestPermission(permissions.CAMERA,
					() => {
						// permission granted
						console.log('permission granted.');
						start();
					},
					() => {
						// permission refused
						console.log('permission refused.');
					});
			}
		});
	} else {
		start();
	}

	function start() {
		const mainWidth = $('main').width();
		const mainHeight = $('main').height();
		console.log('width: ' + mainWidth + ' height: ' + mainHeight);
		// initialization of scanner config
		Quagga.init({
			inputStream: {
				name: "Live",
				type: "LiveStream",
				target: document.querySelector('#scannerContainer'),
				constraints: {
					width: mainWidth,
					height: mainHeight,
					facingMode: 'environment',
				},
			},
			frequency: 20,
			singleChannel: true,
			locator: {
				halfSample: false,
				patchSize: "medium", // x-small, small, medium, large, x-large
				debug: {
					showCanvas: false,
					showPatches: false,
					showFoundPatches: false,
					showSkeleton: true,
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
				],
			},
		},
			function (err) {
				if (err) {
					console.error(err.name + ': ' + err.message);
					return;
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
						Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "white", lineWidth: 2 });
					});
				}
				//precise detection of barcode
				if (result.box) {
					Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "red", lineWidth: 2 });
				}
				//Red line indicating full detection process
				/* if (result.codeResult && result.codeResult.code) {
					Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'rgb(71, 91, 206)', lineWidth: 3 });
				} */
			}
		});

		let results = [];
		let detectedBarCodes = 0;
		const samples = 5;

		Quagga.onDetected(function (result) {
			results.push(result.codeResult.code);

			if (detectedBarCodes === samples) {
				// if we scanned $samples bar codes, stop the scanner
				stopScanner();
				// get the most occuring result in the array (get its mode)
				const mostOccurringBarcode = mode(results);
				// use the most occurring barcode for stuff
				console.log('most occurring barcode: ' + mostOccurringBarcode);
				searchCode(mostOccurringBarcode);
				// reset variables
				results = [];
				detectedBarCodes = 0;
			} else {
				detectedBarCodes++;
			}

			function mode(array) {
				let processed = {};
				// for each result, we count the number of occurrences
				array.forEach(result => {
					// we use an object whose properties are the value of the result, that way we
					// can create a new property called with the name of the result (the barcode)
					// and we then count the number of occurrences of all results.
					if (processed[result] === undefined) { // strict equality
						processed[result] = 1;
					} else {
						processed[result]++;
					}
				});

				// it was so beautiful as a one-liner that I simply had to factor it like that 
				// (sorry for readability... tl;dr: returns the barcode with the highest count)
				return Object.getOwnPropertyNames(processed).reduce((mode, code) => processed[mode] < processed[code] ? code : mode);
			}
		});
	}
}

export function stopScanner() {
	Quagga.stop();
	scannerIsRunning = false;
	document.getElementById("scannerContainer").innerHTML = ""; //removes frozen video window
	console.log('scanner stopped.');
}

function searchCode(code) {
	LoadingWheel.show();
	// we found out that searching for the code in compendium search engine returned the drug
	Meteor.call('searchDrug', code, (err, res) => {
		if (res) {
			if (res[0]) {
				// so we take the first element of search results and scrape it
				Meteor.call('scrapeDrug', `http://www.compendium.ch${res[0].path}`, (error, result) => {
					LoadingWheel.hide();
					if (result) {
						inspectDrugData.set(result);
						Router.go('/details');
						lastActivePage.set('/scan');
						console.log('inspectDrugData: ' + inspectDrugData.get().title);
					}
					if (error) {
						fireSwalErrorMsg("Une erreur s'est produite durant le téléchargement du médicament.")
					}
				});
			} else {
				LoadingWheel.hide();
				fireSwalErrorMsg('Aucun médicament ne correspond à ce code barre.')
			}
		}
		if (err) {
			LoadingWheel.hide();
			fireSwalErrorMsg("Une erreur s'est produite pendant la recherche de médicaments correspondant à ce code barre.")
		}
	});

	function fireSwalErrorMsg(message) {
		Swal.fire({
			title: "Une erreur s'est produite",
			text: message,
			type: 'error',
			buttonsStyling: false,
			customClass: {
				actions: 'swal-buttonsContainer d-flex justify-content-center',
				confirmButton: 'btn btn-lg btn-primary',
			}
		})
	}
}