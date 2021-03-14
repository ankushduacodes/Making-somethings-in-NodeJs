async function getHomePage() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = async function () {
    if (xmlhttp.readyState !== XMLHttpRequest.DONE || xmlhttp.status !== 200) {
      console.log('There was a problem with the request.');
    } else {
      document.open();
      document.write(xmlhttp.responseText);
    }
  };
  const url = 'http://localhost:3000/';
  xmlhttp.open('GET', url, true);
  xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xmlhttp.send();
}

// eslint-disable-next-line no-unused-vars
async function deleteProduct(id) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = async function () {
    if (xmlhttp.readyState !== XMLHttpRequest.DONE || xmlhttp.status !== 200) {
      console.log('There was a problem with the request.');
    } else {
      await getHomePage();
    }
  };
  const url = `http://localhost:3000/delete?id=${id}`;
  xmlhttp.open('DELETE', url, true);
  xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xmlhttp.send();
}
