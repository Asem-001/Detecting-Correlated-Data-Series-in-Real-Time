document.getElementById('sendDataBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const data = { key: 'value' };

    fetch('/sendData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was an error sending the data:', error);
    });
  });