const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

// calls a get request to the server to get the all the ingredients
function getIngredientsCreate() {
    if (!this.ingredients) {
        http.open("GET", baseUrl + "ingredients")
        http.send()
        http.onreadystatechange = (e) => {
            if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
                this.ingredients = JSON.parse(http.responseText)["ingredients"]
                ingredientList()
            }
        }
    }
}

// function getSmoothies() {
//     http.open("GET", baseUrl + "smoothies")
//     http.send()
//     http.onreadystatechange = (e) => {
//         console.log(JSON.parse(http.responseText)["smoothies"])
//     }
// }

// creates a list of checkable ingredients with quantity input
function ingredientList() {
    // create unordered lists for 'create' and 'find'
    let ul_create = document.createElement('ul')
    let ul_find = document.createElement('ul')
    for (let i = 0; i < this.ingredients.length; i++) {
        // create list items for 'creat'e and 'find'
        let li_create = document.createElement('li')
        let li_find = document.createElement('li')

        // create checkbox for 'create' list item
        let checkbox_create = document.createElement('input')
        checkbox_create.setAttribute('type', 'checkbox')
        checkbox_create.setAttribute('id', "create" + i)
        // create label for 'create' list item
        let label_create = document.createElement('label')
        label_create.setAttribute('for', 'checkbox_create')
        label_create.innerHTML = this.ingredients[i].i_name
        // create text input for quantity
        let quantity = document.createElement('input')
        quantity.setAttribute('type', 'text')
        quantity.setAttribute('id', "quantity" + i)
        // create dropdown for unit type
        let unit = document.createElement('select')
        unit.setAttribute('id', "unit" + i)
        let ounce = document.createElement('option')
        ounce.setAttribute('value', 1)
        ounce.innerHTML = "Ounces"
        let cup = document.createElement('option')
        cup.setAttribute('value', 5.3)
        cup.innerHTML = "Cups"
        unit.appendChild(ounce)
        unit.appendChild(cup)
        // append checkbox, label and quantity to 'create' list item
        li_create.appendChild(checkbox_create)
        li_create.appendChild(label_create)
        li_create.appendChild(quantity)
        li_create.appendChild(unit)

        // create checkbox for 'find' list item
        let checkbox_find = document.createElement('input')
        checkbox_find.setAttribute('type', 'checkbox')
        checkbox_find.setAttribute('id', "find" + i)
        // create label for 'find' list item
        let label_find = document.createElement('label')
        label_find.setAttribute('for', 'checkbox_find')
        label_find.innerHTML = this.ingredients[i].i_name
        // append checkbox and label to 'find' list item
        li_find.appendChild(checkbox_find)
        li_find.appendChild(label_find)

        // append list items to unordered list
        ul_create.appendChild(li_create)
        ul_find.appendChild(li_find)
    }
    // add unordered lists to html
    if (document.getElementById('ingredientListCreate')) document.getElementById('ingredientListCreate').appendChild(ul_create)
    if (document.getElementById('ingredientListFind')) document.getElementById('ingredientListFind').appendChild(ul_find)
}

// adds a smoothie to smoothie relation
function createSmoothie() {
    // TODO: if name is null, don't send the post request and show some kind of error
    let name = document.getElementById('sname').value;
    let desc = document.getElementById('sdesc').value;
    let inst = document.getElementById('sinst').value;
    // open post request to /createSmoothie endpoint
    http.open("POST", baseUrl + "createSmoothie?" + "name=" + name + "&instructions=" + inst + "&description=" + desc)
    http.send()
    http.onreadystatechange = (e) => {
        // on success add chosen ingredient to uses relation
        if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
            // retrieve smoothie id from request
            let s_id = JSON.parse(http.responseText)['smoothieId']
            // loop through checkboxs and add ingredients to smoothie if box is checked
            for (let i = 0; i < this.ingredients.length; i++) {
                let checked = document.getElementById("create" + i).checked
                let quan = document.getElementById("quantity" + i)
                let unit = document.getElementById("unit" + i)
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

function findSmoothie() {
    this.smoothies = []
    for (let i = 0; i < this.ingredients.length; i++) {
        let checked = document.getElementById("find" + i).checked
        if (checked) getSmoothie(this.ingredients[i].i_name, new XMLHttpRequest())
    }
}

function getSmoothie(i_name, req) {
    req.open("GET", baseUrl + "getSmoothie")
    req.setRequestHeader("ingredient", i_name)
    req.send()
    req.onreadystatechange = (e) => {
        if (req.status === 200 && req.readyState === XMLHttpRequest.DONE) {
            this.smoothies.push(JSON.parse(req.responseText).smoothies)
            console.log(this.smoothies)
        }
    }
}
