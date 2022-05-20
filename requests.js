const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

this.ingredients = null;

// calls a get request to the server to get the all the ingredients
function getIngredients() {
    http.open("GET", baseUrl + "ingredients")
    http.send()
    http.onreadystatechange = (e) => {
        this.ingredients = JSON.parse(http.responseText)["ingredients"]
    }
}

// creates a list of checkable ingredients
function createIngredientList() {
    // create unordered list
    let list = document.createElement('ul')
    for (let i = 0; i < this.ingredients.length; i++) {
        // create list item
        let item = document.createElement('li')
        // create input for list item
        let input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        // create label for list item
        let label = document.createElement('label')
        label.setAttribute('for', 'checkbox')
        label.innerHTML = this.ingredients[i].i_name
        // append input and label to list item
        item.appendChild(input)
        item.appendChild(label)
        // append list item to unordered list
        list.appendChild(item)
    }
    // add unordered list to html
    document.getElementById('ingredientList').appendChild(list)
}

function getSmoothies() {
    http.open("GET", baseUrl + "smoothies")
    http.send()
    http.onreadystatechange = (e) => {
        console.log(JSON.parse(http.responseText)["smoothies"])
    }
}
