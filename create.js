const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

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

// adds the ingredients to the html
function ingredientList() {
    // create unordered list
    let ul = document.createElement('ul')

    for (let i = 0; i < this.ingredients.length; i++) {
        // create a list item
        let li = document.createElement('li')

        // create a checkbox
        let checkbox = document.createElement('input')
        checkbox.setAttribute('type', 'checkbox')
        checkbox.setAttribute('id', "create" + i)

        // create a label
        let label = document.createElement('label')
        label.setAttribute('for', 'checkbox_create')
        label.innerHTML = this.ingredients[i].i_name

        // create a text input for quantity
        let quantity = document.createElement('input')
        quantity.setAttribute('type', 'text')
        quantity.setAttribute('id', "quantity" + i)

        // create a select input for unit
        let unit = document.createElement('select')
        unit.setAttribute('id', "unit" + i)
        // add ounce as a selectable unit
        let ounce = document.createElement('option')
        ounce.setAttribute('value', 1)
        ounce.innerHTML = "Ounces"
        // add cup as a selectable unit
        let cup = document.createElement('option')
        cup.setAttribute('value', 5.3)
        cup.innerHTML = "Cups"
        unit.appendChild(ounce)
        unit.appendChild(cup)

        // append all elements to the list item
        li.appendChild(checkbox)
        li.appendChild(label)
        li.appendChild(quantity)
        li.appendChild(unit)

        // append list item to the unordered list
        ul.appendChild(li)
    }
    // append the unordered list to the specified div
    if (document.getElementById('ingredientListCreate')) document.getElementById('ingredientListCreate').appendChild(ul)
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
                let quantity = document.getElementById("quantity" + i)
                let unit = document.getElementById("unit" + i)
                // need to create a new request for each ingredient since they are asynchonous
                if (checked) addIngredient(s_id, this.ingredients[i].ingredient_id, quantity.value * unit.value, new XMLHttpRequest())
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
