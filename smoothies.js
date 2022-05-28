const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

function getSmoothies() {
    if (!this.smoothies) {
        http.open("GET", baseUrl + "smoothies")
        http.send()
        http.onreadystatechange = (e) => {
            if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
                this.smoothies = JSON.parse(http.responseText)["smoothies"]
                retrieveSmoothieIngredients()
            }
        }
    }
}

function retrieveSmoothieIngredients() {
    this.smoothieInfoMap = {}
    this.smoothieInfoCount = 0
    this.smoothieIngredientsMap = {}
    this.smoothieIngredientCount = 0
    for (let i = 0; i < this.smoothies.length; i++) {
        getSmoothieInfo(this.smoothies[i].s_name, new XMLHttpRequest())
        getSmoothieIngredients(this.smoothies[i].s_name, new XMLHttpRequest())
    }
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
    tryInfo()
}

function tryInfo() {
    if (this.smoothieIngredientCount == this.smoothies.length && this.smoothieInfoCount == this.smoothies.length) {
        smoothieList()
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

function smoothieList() {
    let accordion = document.getElementById('allSmoothies')
    removePrevious(accordion)
    for (let i = 0; i < this.smoothies.length; i++) {
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
        button.innerHTML = this.smoothies[i].s_name
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
        description.innerHTML = "Description: " + this.smoothies[i].s_description
        container.appendChild(description)

        let instructions = document.createElement('div')
        instructions.setAttribute('class', 'row')
        instructions.innerHTML = "Instructions: " + this.smoothies[i].s_instructions
        container.appendChild(instructions)

        let calories = document.createElement('div')
        calories.setAttribute('class', 'row')
        calories.innerHTML = "Total Calories: " + this.smoothieInfoMap[this.smoothies[i].s_name][0]['total_cal']
        container.appendChild(calories)

        let price = document.createElement('div')
        price.setAttribute('class', 'row')
        price.innerHTML = "Total Price: " + this.smoothieInfoMap[this.smoothies[i].s_name][0]['total_price']
        container.appendChild(price)

        let ingredients = document.createElement('div')
        ingredients.setAttribute('class', 'row')
        let i_string = "Ingredients Used: "
        for (let j = 0; j < this.smoothieIngredientsMap[this.smoothies[i].s_name].length; j++) {
            i_string += this.smoothieIngredientsMap[this.smoothies[i].s_name][j].i_name
            if (j != this.smoothieIngredientsMap[this.smoothies[i].s_name].length - 1) i_string += ", "
        }
        ingredients.innerHTML = i_string
        container.appendChild(ingredients)

    }

}
