const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

this.ingredients = null;

// calls a get request to the server to get the all the ingredients
function getIngredients() {
    http.open("GET", baseUrl + "ingredients")
    http.send()
    http.onreadystatechange = (e) => {
        if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
            this.ingredients = JSON.parse(http.responseText)["ingredients"]
            createIngredientList()
        }
    }
}

function getSmoothies() {
    http.open("GET", baseUrl + "smoothies")
    http.send()
    http.onreadystatechange = (e) => {
        console.log(JSON.parse(http.responseText)["smoothies"])
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
        input.setAttribute('id', i)
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

// adds a smoothie to smoothie relation
function createSmoothie() {
    // throw some kind of error if name is null
    let name = document.getElementById('sname').value;
    let desc = document.getElementById('sdesc').value;
    let inst = document.getElementById('sinst').value;
    // open post request to /createSmoothie endpoint
    http.open("POST", baseUrl + "createSmoothie?" + "name=" + name + "&instructions=" + inst + "&description=" + inst)
    http.send()
    http.onreadystatechange = (e) => {
        // on success add chosen ingredient to uses relation
        if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
            // retrieve smoothie id from request
            let s_id = JSON.parse(http.responseText)['smoothieId']
            // loop through checkboxs and add ingredients to smoothie if box is checked
            for (let i = 0; i < this.ingredients.length; i++) {
                let checked = document.getElementById(i).checked
                // need to create a new request for each ingredient since they are asynchonous
                if (checked) addIngredient(s_id, this.ingredients[i].ingredient_id, 1, new XMLHttpRequest())
            }
        }
    }
}

// adds ingredient to smoothie. should only be called within createSmoothie()
function addIngredient(s_id, i_id, quantity, req) {
    console.log(s_id, i_id, quantity)
    req.open("POST", baseUrl + "addIngredient?" + "s_id=" + s_id + "&i_id=" + i_id + "&quantity=" + quantity)
    req.send()
    req.onreadystatechange = (e) => {
        console.log(JSON.parse(req.responseText))
    }
}
