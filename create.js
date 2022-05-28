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
    let div = document.getElementById('ingredientListCreate')
    div.setAttribute('class', 'container')


    for (let i = 0; i < this.ingredients.length; i++) {
        for (let j = 0; j < 3; j++) {
            let col = document.getElementById('col' + j)
            console.log('col' + j)
            // create a list item
            let div_row = document.createElement('div')
            div_row.setAttribute('class', 'row')
            col.appendChild(div_row)

            // create a checkbox
            let checkbox = document.createElement('input')
            checkbox.setAttribute('type', 'checkbox')
            checkbox.setAttribute('id', "create" + i)
            checkbox.setAttribute('class', 'form-check-input')
            let div_col1 = document.createElement('div')
            div_col1.setAttribute('class', 'col col-sm-5')
            div_col1.appendChild(checkbox)
            div_row.appendChild(div_col1)

            // create a label
            let label = document.createElement('label')
            label.setAttribute('for', 'checkbox')
            label.innerHTML = this.ingredients[i].i_name
            div_col1.appendChild(label)

            // create a text input for quantity
            let quantity = document.createElement('div')
            quantity.setAttribute('class', 'input-group')
            let input = document.createElement('input')
            input.setAttribute('type', 'number')
            input.setAttribute('class', 'form-control')
            input.setAttribute('id', 'quantity' + i)
            input.setAttribute('aria-describedby', 'ounces')
            quantity.appendChild(input)
            let span = document.createElement('span')
            span.setAttribute('class', 'input-group-text')
            span.setAttribute('id', 'ounces')
            span.innerHTML = 'ounces'
            quantity.appendChild(span)
            let div_col2 = document.createElement('div')
            div_col2.setAttribute('class', 'col col-sm-5')
            div_col2.appendChild(quantity)
            div_row.appendChild(div_col2)
            i++
        }
    }
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
                console.log("f")
                let checked = document.getElementById("create" + i).checked
                let quantity = document.getElementById("quantity" + i)
                // need to create a new request for each ingredient since they are asynchonous
                if (checked) addIngredient(s_id, this.ingredients[i].ingredient_id, quantity.value, new XMLHttpRequest())
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
