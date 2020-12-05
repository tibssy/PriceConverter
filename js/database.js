function downloadData() {
    const Http = new XMLHttpRequest();
    const url = 'https://api.exchangeratesapi.io/latest';

    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let rates = JSON.parse(Http.responseText);
            addData(rates);
        }
    }
}

function addData(note) {
    Object.entries(note.rates).forEach(entry => {
        const [key, value] = entry;
        localforage.setItem(key, value);
    });
}

function readData(result) {
    const cur = "HUF";

    localforage.getItem(cur, function (err, value) {
        console.log(value);
        let result2 = Math.round(result * value);
        document.getElementById("result2").innerHTML = result2;
    });

}
