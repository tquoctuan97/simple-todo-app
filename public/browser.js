function templateItem(item) {
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text">${sanitizeHTML(item.text)}</span>
      <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
      </div>
    </li>
    `
}

function sanitizeHTML(text) {
    let element = document.createElement('div');
    element.innerText = text;
    return element.innerHTML;
}
  
// Client-side Render
let ourHTML = items.map(function(item) {
    return templateItem(item)
}).join('')
document.getElementById('listTodo').insertAdjacentHTML('beforeend', ourHTML)

// Create Feature
document.getElementById("formTodo").addEventListener("submit", function(e) {
    e.preventDefault()
    let inputTodo = document.getElementById("inputTodo")
    if(inputTodo.value) {
        axios.post('/create-item', {text: inputTodo.value})
        .then(res => {
            console.log(res.data)
            document.getElementById("listTodo").insertAdjacentHTML('beforeend', templateItem(res.data))
            inputTodo.value = ""
            inputTodo.focus()
        })
        .catch(err => {
            console.log(err)
        })
        
    }
})

document.addEventListener('click', function(e) {
    // Edit Feature
    if(e.target.classList.contains("edit-me")) {
        let value = prompt("Edit Item", e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)
        if(value) {
            axios.post('/edit-item', {text: value, id: e.target.getAttribute("data-id")})
            .then(res => {
                console.log(res.data);
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = sanitizeHTML(value)
            }
            )
            .catch(err => {
                console.log(err)
            })
        }
    }
    
    //Delete Feature
    if(e.target.classList.contains("delete-me")) {
        let answer = confirm("Do you really want to delete this item permanently?")
        if(answer) {
            axios.post('/delete-item', {id: e.target.getAttribute("data-id")})
            .then(res => {
                e.target.parentElement.parentElement.remove()
            })
            .catch(err => {
                console.log("Error")
            })
        }
    }
})