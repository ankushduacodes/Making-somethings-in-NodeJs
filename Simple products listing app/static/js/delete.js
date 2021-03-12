async function deleteProduct(id) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState !== XMLHttpRequest.DONE || xmlhttp.status !== 200) {
            console.log('There was a problem with the request.');
        } else {
            console.log(xmlhttp.responseText);
            location.reload();
        }
    }
    const url = `http://localhost:3000/delete?id=${id}`;
    await xmlhttp.open('DELETE', url, true);
    await xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    await xmlhttp.send();
}
