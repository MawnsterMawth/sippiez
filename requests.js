const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

this.smoothies = []

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
    let ingredientCount = 0
    for (let i = 0; i < this.ingredients.length; i++) {
        let checked = document.getElementById("find" + i).checked
        if (checked) {
            ingredientCount++
            getSmoothie(this.ingredients[i].i_name, new XMLHttpRequest())
        }
    }
    trySmoothie(ingredientCount)
}

function getSmoothie(i_name, req) {
    req.open("GET", baseUrl + "getSmoothie")
    req.setRequestHeader("ingredient", i_name)
    req.send()
    req.onreadystatechange = (e) => {
        if (req.status === 200 && req.readyState === XMLHttpRequest.DONE) {
            this.smoothies.push(JSON.parse(req.responseText).smoothies)
        }
    }
}

function trySmoothie(ingredientCount) {
    if (this.smoothies.length == ingredientCount) {
        sortSmoothies()
    } else {
        setTimeout(trySmoothie, 300, ingredientCount)
    }
}

function sortSmoothies() {
    let smoothieFrequency = {}
    this.smoothieInfoMap = {}
    for (let i = 0; i < this.smoothies.length; i++) {
        for (let j = 0; j < this.smoothies[i].length; j++) {
            if (smoothieFrequency[this.smoothies[i][j].s_name]) smoothieFrequency[this.smoothies[i][j].s_name] += 1
            else smoothieFrequency[this.smoothies[i][j].s_name] = 1
            this.smoothieInfoMap[this.smoothies[i][j].s_name] = [this.smoothies[i][j].s_description, this.smoothies[i][j].s_instructions]
        }
    }
    let items = Object.keys(smoothieFrequency).map(key => {
        return [key, smoothieFrequency[key]]
    })
    items.sort((first, second) => {
        return second[1] - first[1]
    })
    items.forEach(item => {
        item.splice(1, 1)
    })
    this.sortedSmoothies = [].concat.apply([], items)
    console.log(this.sortedSmoothies)
    console.log(this.smoothieInfoMap)
    smoothieListFind()
}

// TODO: Create a list on the html file using sortedSmoothies and smoothieInfoMap
function smoothieListFind() {
    let ul = document.createElement('ul')
    for (let i = 0; i < this.sortedSmoothies.length; i++) {
        let li = document.createElement('li')

        let label_name = document.createElement('label')
        label_name.innerHTML = this.sortedSmoothies[i]

        let label_description = document.createElement('label')
        label_description.innerHTML = this.smoothieInfoMap[this.sortedSmoothies[i]][0]

        let label_instructions = document.createElement('label')
        label_instructions.innerHTML = this.smoothieInfoMap[this.sortedSmoothies[i]][1]

        li.appendChild(label_name)
        li.appendChild(label_description)
        li.appendChild(label_instructions)

        ul.appendChild(li)
    }
    if (document.getElementById('smoothieListFind')) document.getElementById('smoothieListFind').appendChild(ul)
}
