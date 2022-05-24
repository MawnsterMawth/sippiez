const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

this.ingredients = null;

// calls a get request to the server to get the all the ingredients
function getIngredientsCreate() {
    http.open("GET", baseUrl + "ingredients")
    http.send()
    http.onreadystatechange = (e) => {
        if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
            this.ingredients = JSON.parse(http.responseText)["ingredients"]
            createSmoothieList()
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

// creates a list of checkable ingredients with quantity input
function createSmoothieList() {
    // create unordered list
    let ul = document.createElement('ul')
    for (let i = 0; i < this.ingredients.length; i++) {
        // create list item
        let li = document.createElement('li')
        // create checkbox for list item
        let checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.setAttribute('id', i)
        // create label for list item
        let label = document.createElement('label')
        label.setAttribute('for', 'checkbox')
        label.innerHTML = this.ingredients[i].i_name
        // create text input for quantity
        let quantity = document.createElement('input')
        quantity.setAttribute('type', 'text')
        quantity.setAttribute('id', "q" + i)
        // create dropdown for unit type
        let unit = document.createElement('select')
        unit.setAttribute('id', "u" + i)
        let ounce = document.createElement('option')
        ounce.setAttribute('value', 1)
        ounce.innerHTML = "Ounces"
        let cup = document.createElement('option')
        cup.setAttribute('value', 5.3)
        cup.innerHTML = "Cups"
        unit.appendChild(ounce)
        unit.appendChild(cup)
        // append checkbox, label and quantity to list item
        li.appendChild(checkbox)
        li.appendChild(label)
        li.appendChild(quantity)
        li.appendChild(unit)
        // append list item to unordered list
        ul.appendChild(li)
    }
    // add unordered list to html
    document.getElementById('ingredientList').appendChild(ul)
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
                let quan = document.getElementById("q" + i)
                let unit = document.getElementById("u" + i)
                // need to create a new request for each ingredient since they are asynchonous
                if (checked) addIngredient(s_id, this.ingredients[i].ingredient_id, quan.value * unit.value, new XMLHttpRequest())
            }
        }
    }
}

// adds ingredient to smoothie. should only be called within createSmoothie()
function addIngredient(s_id, i_id, quantity, req) {
    req.open("POST", baseUrl + "addIngredient?" + "s_id=" + s_id + "&i_id=" + i_id + "&quantity=" + quantity)
    req.send()
    req.onreadystatechange = (e) => {
        if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
            console.log(JSON.parse(req.responseText))
        }
    }
}
