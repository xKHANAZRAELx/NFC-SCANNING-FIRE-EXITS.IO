// Your Google Apps Script Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbygv9lpr5SV8mNUG0Vbd4GHx3Mbzjlgp8lm-npPZTkJ/exec';

// Function to send data to Google Apps Script
function sendData(data) {
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        document.getElementById('status').innerText = 'NFC tag scanned and data sent!';
    })
    .catch(error => {
        document.getElementById('status').innerText = 'Error: ' + error.message;
    });
}

// Handling NFC tag scanning
if ('NDEFReader' in window) {
    const ndef = new NDEFReader();
    ndef.scan().then(() => {
        document.getElementById('status').innerText = 'Scan an NFC tag!';
        
        ndef.onreading = event => {
            const decoder = new TextDecoder();
            const record = event.message.records[0];
            const tagData = decoder.decode(record.data);

            // Prepare the data to send
            const payload = {
                location: tagData,
                timestamp: new Date().toISOString()
            };

            // Send the data to the Google Apps Script Web App
            sendData(payload);
        };
    }).catch(error => {
        document.getElementById('status').innerText = 'NFC scanning not supported on this device or an error occurred: ' + error.message;
    });
} else {
    document.getElementById('status').innerText = 'NFC scanning not supported on this device.';
}
