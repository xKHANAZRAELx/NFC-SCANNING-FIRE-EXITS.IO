document.getElementById('scanButton').addEventListener('click', () => {
    if ('NDEFReader' in window) {
        const reader = new NDEFReader();
        reader.scan().then(() => {
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
                    })
                })
                .then(response => response.text())
                .then(data => {
                    alert('NFC tag scanned and data sent to Google Sheets.');
                })
                .catch(error => console.error('Error:', error));
            };
        }).catch(error => console.error('Error:', error));
    } else {
        alert('NFC scanning is not supported in your browser.');
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
