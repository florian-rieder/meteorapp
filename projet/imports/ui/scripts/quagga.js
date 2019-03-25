import Quagga from "quagga"
import '../templates/quag_scan.html'

//Flag for scanner status
let _scannerIsRunning = false;

function startScanner() {
    //initialization of scanner config
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'),
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
    },
    
    function (err) {
        if (err) {
            console.log(err);
            return
        }

        console.log("Initialization finished. Ready to start");
        Quagga.start();

        // Set flag to is running
        _scannerIsRunning = true;
    });

    Quagga.onDetected(function (result) {
        console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
    }); 
}


// Start/stop scanner

Template.quag_scan.events({
    'click #scan_btn' () {
        if (_scannerIsRunning) {
            Quagga.stop();
        } else {
            startScanner();
        }
    }
})
