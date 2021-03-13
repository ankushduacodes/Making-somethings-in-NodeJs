async function deleteProduct(id) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = async function () {
        if (xmlhttp.readyState !== XMLHttpRequest.DONE || xmlhttp.status !== 200) {
            console.log('There was a problem with the request.');
        } else {
            await getHomePage();
        }
    }
    const url = `http://localhost:3000/delete?id=${id}`;
    await xmlhttp.open('DELETE', url, true);
    await xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    await xmlhttp.send();
}


async function getHomePage() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = async function () {
        if (xmlhttp.readyState !== XMLHttpRequest.DONE || xmlhttp.status !== 200) {
            console.log('There was a problem with the request.');
        } else {
            document.open();
            document.write(xmlhttp.responseText);
        }
    }
    const url = `http://localhost:3000/`;
    await xmlhttp.open('GET', url, true);
    // await xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    await xmlhttp.send();
}
