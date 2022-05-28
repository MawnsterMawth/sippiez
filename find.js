const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

function getIngredientsFind() {
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
    for (let i = 0; i < this.ingredients.length; i++) {
        for (let j = 0; j < 3 && i < this.ingredients.length; j++, i++) {
            console.log(i)
            let col = document.getElementById('col' + j)
            // create list items for 'creat'e and 'find'
            let div_row = document.createElement('div')
            div_row.setAttribute('class', 'row')
            col.appendChild(div_row)

            // create checkbox for 'find' list item
            let checkbox = document.createElement('input')
            checkbox.setAttribute('type', 'checkbox')
            checkbox.setAttribute('id', "find" + i)
            checkbox.setAttribute('class', 'form-check-input me-1')
            let div_col1 = document.createElement('div')
            div_col1.setAttribute('class', 'col')
            div_col1.appendChild(checkbox)
            div_row.appendChild(div_col1)
            // create a label
            let label = document.createElement('label')
            label.setAttribute('for', 'checkbox_create')
            label.innerHTML = this.ingredients[i].i_name
            div_col1.appendChild(label)
        }
        i--
    }
}

function findSmoothie() {
    this.smoothies = []
    let ingredientCount = 0
    for (let i = 0; i < this.ingredients.length; i++) {
        console.log(document.getElementById("find" + i))
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

// wait until findSmoothie is done before sorting the smoothies
function trySmoothie(ingredientCount) {
    if (this.smoothies.length == ingredientCount) {
        sortSmoothies()
    } else {
        setTimeout(trySmoothie, 300, ingredientCount)
    }
}

function sortSmoothies() {
    // find the frequency of chosen ingredients in each smoothie
    let smoothieFrequency = {}
    this.smoothieDescInstMap = {}
    for (let i = 0; i < this.smoothies.length; i++) {
        for (let j = 0; j < this.smoothies[i].length; j++) {
            if (smoothieFrequency[this.smoothies[i][j].s_name]) smoothieFrequency[this.smoothies[i][j].s_name] += 1
            else smoothieFrequency[this.smoothies[i][j].s_name] = 1
            // map the smoothie name to its description and instructions
            this.smoothieDescInstMap[this.smoothies[i][j].s_name] = [this.smoothies[i][j].s_description, this.smoothies[i][j].s_instructions]
        }
    }
    // sort the smoothies by frequency
    let items = Object.keys(smoothieFrequency).map(key => { return [key, smoothieFrequency[key]] })
    items.sort((first, second) => { return second[1] - first[1] })
    items.forEach(item => { item.splice(1, 1) })
    // merge the sorted smoothies to one list
    this.sortedSmoothies = [].concat.apply([], items)
    // create the list of smoothies and put it on the html
    //smoothieListFind()
    retrieveSmoothieInfo()
}

function retrieveSmoothieInfo() {
    this.smoothieInfoMap = {}
    this.smoothieInfoCount = 0
    this.smoothieIngredientsMap = {}
    this.smoothieIngredientCount = 0
    for (let i = 0; i < this.sortedSmoothies.length; i++) {
        getSmoothieInfo(this.sortedSmoothies[i], new XMLHttpRequest())
        getSmoothieIngredients(this.sortedSmoothies[i], new XMLHttpRequest())
    }
    tryInfo()
}

function getSmoothieInfo(s_name, req) {
    req.open("GET", baseUrl + "getSmoothieInfo")
    req.setRequestHeader("sname", s_name)
    req.send()
    req.onreadystatechange = (e) => {
        if (req.status === 200 && req.readyState === XMLHttpRequest.DONE) {
            this.smoothieInfoMap[s_name] = JSON.parse(req.responseText).info
            this.smoothieInfoCount++
        }
    }
}

function getSmoothieIngredients(s_name, req) {
    req.open("GET", baseUrl + "getSmoothieIngredients")
    req.setRequestHeader("sname", s_name)
    req.send()
    req.onreadystatechange = (e) => {
        if (req.status === 200 && req.readyState === XMLHttpRequest.DONE) {
            this.smoothieIngredientsMap[s_name] = JSON.parse(req.responseText).ingredients
            this.smoothieIngredientCount++
        }
    }
}

function tryInfo() {
    if (this.smoothieInfoCount == this.sortedSmoothies.length && this.smoothieIngredientCount == this.sortedSmoothies.length) {
        smoothieListFind()
    } else {
        setTimeout(tryInfo, 300)
    }
}

function removePrevious(accordion) {
    let i = 0
    while (document.getElementById('accordion-item' + i)) {
        document.getElementById('accordion-item' + i).parentNode.removeChild(document.getElementById('accordion-item' + i))
        i++
    }
}

function smoothieListFind() {
    let accordion = document.getElementById('smoothieListFind')
    removePrevious(accordion)
    for (let i = 0; i < this.sortedSmoothies.length; i++) {
        let div = document.createElement('div')
        div.setAttribute('class', 'accordion-item')
        div.setAttribute('id', 'accordion-item' + i)
        accordion.appendChild(div)

        let h2 = document.createElement('h2')
        h2.setAttribute('class', 'accordian-header')
        h2.setAttribute('id', 'heading' + i)
        div.appendChild(h2)

        let button = document.createElement('button')
        button.setAttribute('class', 'accordian-button')
        button.setAttribute('type', 'button')
        button.setAttribute('data-bs-toggle', 'collapse')
        button.setAttribute('data-bs-target','#collapse' + i)
        button.setAttribute('aria-expanded', 'false')
        button.setAttribute('aria-controls', 'collapse' + i)
        button.innerHTML = this.sortedSmoothies[i]
        h2.appendChild(button)

        let inner_div = document.createElement('div')
        inner_div.setAttribute('class', 'accordion-collapse collapse')
        inner_div.setAttribute('id', 'collapse' + i)
        inner_div.setAttribute('aria-labelledby', 'heading' + i)
        inner_div.setAttribute('data-bs-parent', 'smoothieListFind')
        div.appendChild(inner_div)

        let inner_div_body = document.createElement('div')
        inner_div_body.setAttribute('class', 'accordion-body')
        inner_div.appendChild(inner_div_body)

        let container = document.createElement('div')
        container.setAttribute('class', 'container')
        inner_div_body.appendChild(container)

        let description = document.createElement('div')
        description.setAttribute('class', 'row')
        description.innerHTML = "Description: " + this.smoothieDescInstMap[this.sortedSmoothies[i]][0]
        container.appendChild(description)

        let instructions = document.createElement('div')
        instructions.setAttribute('class', 'row')
        instructions.innerHTML = "Instructions: " + this.smoothieDescInstMap[this.sortedSmoothies[i]][1]
        container.appendChild(instructions)

        let calories = document.createElement('div')
        calories.setAttribute('class', 'row')
        calories.innerHTML = "Total Calories: " + this.smoothieInfoMap[this.sortedSmoothies[i]][0]['total_cal']
        container.appendChild(calories)

        let price = document.createElement('div')
        price.setAttribute('class', 'row')
        price.innerHTML = "Total Price: " + this.smoothieInfoMap[this.sortedSmoothies[i]][0]['total_price']
        container.appendChild(price)

        let ingredients = document.createElement('div')
        ingredients.setAttribute('class', 'row')
        let i_string = "Ingredients Used: "
        for (let j = 0; j < this.smoothieIngredientsMap[this.sortedSmoothies[i]].length; j++) {
            i_string += this.smoothieIngredientsMap[this.sortedSmoothies[i]][j].i_name
            if (j != this.smoothieIngredientsMap[this.sortedSmoothies[i]].length - 1) i_string += ", "
        }
        ingredients.innerHTML = i_string
        container.appendChild(ingredients)

    }

}
