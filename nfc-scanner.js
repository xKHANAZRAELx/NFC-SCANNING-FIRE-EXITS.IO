document.addEventListener('DOMContentLoaded', () => {
    if ('NDEFReader' in window) {
        const reader = new NDEFReader();
        reader.scan().then(() => {
            console.log('NFC reader is ready to scan.');
            document.getElementById('status').textContent = 'NFC reader is ready to scan. Please hold your device near an NFC tag.';

            reader.onreading = (event) => {
                const record = event.message.records[0];
                const decoder = new TextDecoder();
                const location = decoder.decode(record.data);
                const timeOfDay = determineTimeOfDay();

                fetch('https://script.google.com/macros/s/AKfycbxir4SvkAzLI-u_MKRkUWev8pWSL8IpbhlQyyQvgIj8OzHv02aQcJcCILG9GtFn4V2_/exec', {
                    method: 'POST',
                    body: JSON.stringify({
                        location: location,
                        timeOfDay: timeOfDay
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.text())
                .then(data => {
                    console.log('Data sent to Google Sheets:', data);
                    document.getElementById('status').textContent = 'NFC tag scanned and data sent to Google Sheets.';
                })
                .catch(error => {
                    console.error('Error sending data to Google Sheets:', error);
                    document.getElementById('status').textContent = 'Error sending data to Google Sheets.';
                });
            };

        }).catch(error => {
            console.error('Error during NFC scan:', error);
            document.getElementById('status').textContent = 'Error: NFC scanning is not supported or failed.';
        });
    } else {
        document.getElementById('status').textContent = 'NFC scanning is not supported in your browser.';
    }
});

function determineTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return 'morning';
    } else if (hour < 18) {
        return 'afternoon';
    } else {
        return 'night';
    }
}
