const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

// retrieves the ingredient list from the database
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

// posts a smoothie to the database
function createSmoothie() {
    let name = document.getElementById('sname').value;
    let desc = document.getElementById('sdesc').value;
    let inst = document.getElementById('sinst').value;

    http.open("POST", baseUrl + "createSmoothie?" + "name=" + name + "&instructions=" + inst + "&description=" + desc)
    http.send()
    http.onreadystatechange = (e) => {
        if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
            // retrieve smoothie id from request
            let s_id = JSON.parse(http.responseText)['smoothieId']
            // loop through checkboxes and add ingredients to smoothie if box is checked
            for (let i = 0; i < this.ingredients.length; i++) {
                let checked = document.getElementById("create" + i).checked
                let quantity = document.getElementById("quantity" + i)
                if (checked) addIngredient(s_id, this.ingredients[i].ingredient_id, quantity.value, new XMLHttpRequest())
            }
            // display a success message after smoothie is added to the database
            var success = document.getElementById("error")
            success.setAttribute('class', 'alert alert-primary')
            success.style = 'visibility: show;'
            success.style.color = "black"
            success.textContent = "Smoothie successfully created."
        }
    }
}

// posts the ingredient for a smoothie to the database
function addIngredient(s_id, i_id, quantity, req) {
    req.open("POST", baseUrl + "addIngredient?" + "s_id=" + s_id + "&i_id=" + i_id + "&quantity=" + quantity)
    req.send()
    req.onreadystatechange = (e) => {
        if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
            console.log(JSON.parse(req.responseText))
        }
    }
}

// checks to see all the required inputs are filled out before adding the smoothie to the database
function checkRequirements() {
    var error = document.getElementById("error")
    error.setAttribute('class', 'alert alert-danger')
    error.style.color = "red"
    // error message for no name input
    if (!document.getElementById('sname').value) {
        error.style = 'visibility: show;'
        error.textContent = "Please enter a name for the smoothie."
        return
    }
    let guard = false
    for (let i = 0; i < this.ingredients.length; i++) {
        let checked = document.getElementById("create" + i).checked
        let quantity = document.getElementById("quantity" + i)
        if (checked) guard = checked
        // error message for no quantity on a checked ingredient
        if (checked && !quantity.value) {
            error.style = 'visibility: show;'
            error.textContent = "Please enter a quantity for the chosen ingredients."
            return
        }
        // error message for invalid quantity on a checked ingredient
        if (checked && quantity.value < 1) {
            error.style = 'visibility: show;'
            error.textContent = "Quantity must be a number greater than 0."
            return
        }
    }
    // error message for no ingredients checked
    if (!guard) {
        error.style = 'visibility: show;'
        error.textContent = "Please choose ingredients for your smoothie."
        return
    }
    createSmoothie()
}

// adds the ingredients to the html
function ingredientList() {
    for (let i = 0; i < this.ingredients.length; i++) {
        for (let j = 0; j < 3 && i < this.ingredients.length; j++, i++) {
            // get the column
            let col = document.getElementById('col' + j)
            // create a row and append to column
            let div_row = document.createElement('div')
            div_row.setAttribute('class', 'row')
            col.appendChild(div_row)
            // create column 1 and append to row
            let div_col1 = document.createElement('div')
            div_col1.setAttribute('class', 'col col-sm-5')
            div_row.appendChild(div_col1)
            // create a checkbox and append to column 1
            let checkbox = document.createElement('input')
            checkbox.setAttribute('type', 'checkbox')
            checkbox.setAttribute('id', "create" + i)
            checkbox.setAttribute('class', 'form-check-input')
            div_col1.appendChild(checkbox)
            // create a label and append to column 1
            let label = document.createElement('label')
            label.setAttribute('for', 'checkbox')
            label.innerHTML = this.ingredients[i].i_name
            div_col1.appendChild(label)
            // create column 2 and append to row
            let div_col2 = document.createElement('div')
            div_col2.setAttribute('class', 'col col-sm-5')
            div_row.appendChild(div_col2)
            // create an input and append to column 2
            let quantity = document.createElement('div')
            quantity.setAttribute('class', 'input-group')
            div_col2.appendChild(quantity)
            // create a number input and append to input
            let input = document.createElement('input')
            input.setAttribute('type', 'number')
            input.setAttribute('class', 'form-control')
            input.setAttribute('id', 'quantity' + i)
            input.setAttribute('aria-describedby', 'ounces')
            quantity.appendChild(input)
            // create a post label and append to input
            let span = document.createElement('span')
            span.setAttribute('class', 'input-group-text')
            span.setAttribute('id', 'ounces')
            span.innerHTML = 'ounces'
            quantity.appendChild(span)
        }
        i--
    }
}
