async function test() {
    let url = "http://localhost:3000/overlay/data";
    let response = await fetch(url);

    if (response.ok) {
        let json = await response.json();
        console.log(json);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

test();