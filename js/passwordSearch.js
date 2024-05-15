fetch("../json/pass.json")
    .then((response) => response.json())
    .then((json) => console.log(json));