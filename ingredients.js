const http = new XMLHttpRequest()
const baseUrl = 'https://sippiez.herokuapp.com/'

// fetches ingredients from database and puts it in this.ingredients
function getIngredients() {
    document.getElementById('loading1').style = 'visibility: show;'
    document.getElementById('loading2').style = 'visibility: show;'
    document.getElementById('loading3').style = 'visibility: show;'
    document.getElementById('loading4').style = 'visibility: show;'
    document.getElementById('loading5').style = 'visibility: show;'
    if (!this.ingredients) {
        http.open("GET", baseUrl + "ingredients")
        http.send()
        http.onreadystatechange = (e) => {
            if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
                this.ingredients = JSON.parse(http.responseText)["ingredients"]
                this.count = 0
                for (let i = 0; i < this.ingredients.length; i++) getIngredientSmoothieCount(this.ingredients[i].i_name, i, new XMLHttpRequest())
                tryIngredientList()
            }
        }
    }
}

// fetches the amount of smoothies a certain ingredient is used in
function getIngredientSmoothieCount(i_name, index, req) {
    req.open("GET", baseUrl + "ingredientCount")
    req.setRequestHeader("i_name", i_name)
    req.send()
    req.onreadystatechange = (e) => {
        if (req.status === 200 && req.readyState === XMLHttpRequest.DONE) {
            this.ingredients[index]['count'] = JSON.parse(req.responseText).count
            this.count++
        }
    }
}

// waits for all the getIngredientSmoothieCount requests to finish before generating the html
function tryIngredientList() {
    if (this.count == this.ingredients.length) ingredientList()
    else setTimeout(tryIngredientList, 300)
}

// generates the html for the ingredient list
function ingredientList() {
    for (let i = 0; i < this.ingredients.length; i++) {
        let col = document.getElementById(this.ingredients[i].i_type)
        if (!document.getElementById(this.ingredients[i].i_name + 'accordion')) {
            let temp = document.createElement('div')
            temp.setAttribute('class', 'accordion')
            temp.setAttribute('id', this.ingredients[i].i_name + 'accordion')
            col.appendChild(temp)
        }
        let accordion = document.getElementById(this.ingredients[i].i_name + 'accordion')

        let item = document.createElement('div')
        item.setAttribute('class', 'accordion-item')
        item.setAttribute('id', 'accordion-item' + i)
        accordion.appendChild(item)

        let h2 = document.createElement('h2')
        h2.setAttribute('class', 'accordian-header')
        h2.setAttribute('id', 'heading' + i)
        item.appendChild(h2)

        let button = document.createElement('button')
        button.setAttribute('class', 'accordion-button')
        button.setAttribute('type', 'button')
        button.setAttribute('data-bs-toggle', 'collapse')
        button.setAttribute('data-bs-target','#collapse' + i)
        button.setAttribute('aria-expanded', 'false')
        button.setAttribute('aria-controls', 'collapse' + i)
        button.innerHTML = this.ingredients[i].i_name
        h2.appendChild(button)

        let inner_div = document.createElement('div')
        inner_div.setAttribute('class', 'accordion-collapse collapse')
        inner_div.setAttribute('id', 'collapse' + i)
        inner_div.setAttribute('aria-labelledby', 'heading' + i)
        inner_div.setAttribute('data-bs-parent', 'smoothieListFind')
        item.appendChild(inner_div)

        let inner_div_body = document.createElement('div')
        inner_div_body.setAttribute('class', 'accordion-body')
        inner_div.appendChild(inner_div_body)

        let container = document.createElement('div')
        container.setAttribute('class', 'container')
        inner_div_body.appendChild(container)

        let calorie_description = document.createElement('div')
        calorie_description.setAttribute('class', 'row')
        calorie_description.innerHTML = "Calories per ounce: " + this.ingredients[i].cal_per_unit
        container.appendChild(calorie_description)

        let price_description = document.createElement('div')
        price_description.setAttribute('class', 'row')
        price_description.innerHTML = "Calories per ounce: " + this.ingredients[i].price_per_unit
        container.appendChild(price_description)

        let count_description = document.createElement('div')
        count_description.setAttribute('class', 'row')
        count_description.innerHTML = "Used in " + this.ingredients[i].count + " smoothies"
        container.appendChild(count_description)
    }
    document.getElementById('loading1').style = 'visibility: hidden;'
    document.getElementById('loading2').style = 'visibility: hidden;'
    document.getElementById('loading3').style = 'visibility: hidden;'
    document.getElementById('loading4').style = 'visibility: hidden;'
    document.getElementById('loading5').style = 'visibility: hidden;'
}
