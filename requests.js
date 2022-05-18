const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

function getIngredients() {
    http.open("GET", baseUrl + "ingredients")
    http.send()
    http.onreadystatechange = (e) => {
        console.log(JSON.parse(http.responseText)["ingredients"])
    }
}

function getSmoothies() {
    http.open("GET", baseUrl + "smoothies")
    http.send()
    http.onreadystatechange = (e) => {
        console.log(JSON.parse(http.responseText)["smoothies"])
    }
}
