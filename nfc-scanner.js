document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbxir4SvkAzLI-u_MKRkUWev8pWSL8IpbhlQyyQvgIj8OzHv02aQcJcCILG9GtFn4V2_/exec';

    if ('NDEFReader' in window) {
        statusElement.textContent = 'NFC is supported. Please hold your device near an NFC tag.';

        const reader = new NDEFReader();
        reader.scan().then(() => {
            reader.onreading = (event) => {
                const record = event.message.records[0];
                const decoder = new TextDecoder();
                const location = decoder.decode(record.data);
                const timeOfDay = determineTimeOfDay();

                fetch(webAppUrl, {
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
                    statusElement.textContent = 'NFC Tag Scanned and data sent to Google Sheets.';
                })
                .catch(error => {
                    console.error('Error:', error);
                    statusElement.textContent = 'Error sending data to Google Sheets.';
                });
            };

            reader.onerror = (error) => {
                console.error('NFC Reader Error:', error);
                statusElement.textContent = `NFC Error: ${error.message}`;
            };
        }).catch(error => {
            console.error('Error during NFC scan:', error);
            statusElement.textContent = `Error during NFC scan: ${error.message}`;
        });
    } else {
        statusElement.textContent = 'NFC scanning is not supported in this browser.';
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
