const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

function getSmoothies() {
    if (!this.smoothies) {
        http.open("GET", baseUrl + "smoothies")
        http.send()
        http.onreadystatechange = (e) => {
            if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
                this.smoothies = JSON.parse(http.responseText)["smoothies"]
                console.log(this.smoothies)
            }
        }
    }
}
