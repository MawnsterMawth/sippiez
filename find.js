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
    let ul_find = document.createElement('ul')
    for (let i = 0; i < this.ingredients.length; i++) {
        // create list items for 'creat'e and 'find'
        let li_find = document.createElement('li')

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
        ul_find.appendChild(li_find)
    }
    // add unordered lists to html
    if (document.getElementById('ingredientListFind')) document.getElementById('ingredientListFind').appendChild(ul_find)
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
    this.smoothieInfoMap = {}
    for (let i = 0; i < this.smoothies.length; i++) {
        for (let j = 0; j < this.smoothies[i].length; j++) {
            if (smoothieFrequency[this.smoothies[i][j].s_name]) smoothieFrequency[this.smoothies[i][j].s_name] += 1
            else smoothieFrequency[this.smoothies[i][j].s_name] = 1
            // map the smoothie name to its description and instructions
            this.smoothieInfoMap[this.smoothies[i][j].s_name] = [this.smoothies[i][j].s_description, this.smoothies[i][j].s_instructions]
        }
    }
    // sort the smoothies by frequency
    let items = Object.keys(smoothieFrequency).map(key => { return [key, smoothieFrequency[key]] })
    items.sort((first, second) => { return second[1] - first[1] })
    items.forEach(item => { item.splice(1, 1) })
    // merge the sorted smoothies to one list
    this.sortedSmoothies = [].concat.apply([], items)
    // create the list of smoothies and put it on the html
    smoothieListFind()
}

// TODO: need some formatting on this
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
