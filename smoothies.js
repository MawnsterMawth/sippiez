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
    this.smoothieNameMap = {}
    this.smoothieInfoMap = {}
    this.smoothieInfoCount = 0
    this.smoothieIngredientsMap = {}
    this.smoothieIngredientCount = 0
    for (let i = 0; i < this.smoothies.length; i++) {
        this.smoothieNameMap[this.smoothies[i].s_name] = this.smoothies[i]
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
        button.setAttribute('class', 'accordion-button')
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

function parseFilters() {
    let error = document.getElementById('error')
    error.style = 'visibility: hidden;'

    let fruit = document.getElementById('fruits')
    let vegetable = document.getElementById('vegetables')
    let nut = document.getElementById('nuts')
    let dairy = document.getElementById('dairy')
    let seed = document.getElementById('seeds')

    let uses = [fruit, vegetable, nut, dairy, seed]

    let nofruit = document.getElementById('nofruits')
    let novegetable = document.getElementById('novegetables')
    let nonut = document.getElementById('nonuts')
    let nodairy = document.getElementById('nodairy')
    let noseed = document.getElementById('noseeds')

    let nouses = [nofruit, novegetable, nonut, nodairy, noseed]

    if ((fruit.checked && nofruit.checked) ||
        (vegetable.checked && novegetable.checked) ||
        (nut.checked && nonut.checked) ||
        (dairy.checked && nodairy.checked) ||
        (seed.checked && noseed.checked)) {
            error.setAttribute('class', 'alert alert-danger')
            error.style.color = "red"
            error.style = 'visibility: show;'
            error.textContent = "Can't select the same type in 'Uses ingredient of type' and 'Doesn't use ingredients of type'."
            return
    }
    document.getElementById('loading').style = 'visibility: show;'
    document.getElementById('allSmoothies').style = 'visibility: hidden;'
    this.uses = []
    this.usesCount = 0
    for (let i = 0; i < uses.length; i++) {
        if (uses[i].checked) {
            this.usesCount++
            getUses(uses[i].value, new XMLHttpRequest())
        }
    }
    this.nouses = []
    this.nousesCount = 0
    for (let i = 0; i < nouses.length; i++) {
        if (nouses[i].checked) {
            this.nousesCount++
            getNouses(nouses[i].value, new XMLHttpRequest())
        }
    }
    tryJoin()
}

function tryJoin() {
    if (this.uses.length >= this.usesCount && this.nouses.length >= this.nousesCount) {
        joinLists()
    } else {
        setTimeout(tryJoin, 300)
    }
}

function joinLists() {
    // do union on uses
    this.uses = [].concat.apply([], this.uses)
    this.uses.forEach((item, i) => {
        this.uses[i] = item.s_name
    });
    this.uses = [... new Set(this.uses)]
    // do intersection on nouses
    this.nouses.forEach((list, i) => {
        list.forEach((object, j) => {
            this.nouses[i][j] = object.s_name
        });
    });
    if (this.nouses.length > 0) this.nouses = this.nouses.reduce((a, b) => a.filter(c => b.includes(c)))
    // do intersection on uses and nouses
    this.combined = []
    if (this.uses.length > 0 && this.nouses.length > 0) {
        this.combined = [this.uses, this.nouses].reduce((a, b) => a.filter(c => b.includes(c)))
    } else if (this.uses.length > 0) {
        this.combined = this.uses
    } else {
        this.combined = this.nouses
    }
    let guard = false
    if (document.getElementById('priceLowToHigh').checked) {
        console.log('in');
        getSorted('sortPriceAsc')
        guard = true
    } else if (document.getElementById('priceHighToLow').checked) {
        getSorted('sortPriceDesc')
        guard = true
    } else if (document.getElementById('caloriesLowToHigh').checked) {
        getSorted('sortCalAsc')
        guard = true
    } else if (document.getElementById('caloriesHighToLow').checked) {
        getSorted('sortCalDesc')
        guard = true
    }
    if (guard) {
        trySort()
    } else {
        this.smoothies = []
        combined.forEach((item, i) => {
            this.smoothies.push(this.smoothieNameMap[item])
        });
        document.getElementById('loading').style = 'visibility: hidden;'
        document.getElementById('allSmoothies').style = 'visibility: show;'
        smoothieList()
    }
}

function trySort() {
    if (this.sorted) {
        this.sorted.forEach((item, i) => {
            this.sorted[i] = item.s_name
        });
        this.sorted = this.sorted.filter((x) => this.combined.includes(x))
        this.smoothies = []
        this.sorted.forEach((item, i) => {
            this.smoothies.push(this.smoothieNameMap[item])
        });
        document.getElementById('loading').style = 'visibility: hidden;'
        document.getElementById('allSmoothies').style = 'visibility: show;'
        smoothieList()
        return
    } else {
        setTimeout(trySort, 300)
    }
}

function getUses(i_type, req) {
    req.open("GET", baseUrl + "getType?type=" + i_type)
    req.send()
    req.onreadystatechange = (e) => {
        if (req.status === 200 && req.readyState === XMLHttpRequest.DONE) {
            this.uses.push(JSON.parse(req.responseText)['smoothies'])
        }
    }
}

function getNouses(i_type, req) {
    req.open("GET", baseUrl + "getNotType?type=" + i_type)
    req.send()
    req.onreadystatechange = (e) => {
        if (req.status === 200 && req.readyState === XMLHttpRequest.DONE) {
            this.nouses.push(JSON.parse(req.responseText)['smoothies'])
        }
    }
}

function getSorted(url_addon) {
    http.open("GET", baseUrl + url_addon)
    http.send()
    http.onreadystatechange = (e) => {
        if (http.status === 200 && http.readyState === XMLHttpRequest.DONE) {
            this.sorted = JSON.parse(http.responseText)['smoothies']
        }
    }
}
