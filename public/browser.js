document.addEventListener('click', function(e) {
    if(e.target.classList.contains("edit-me")) {
        let value = prompt("Edit Item", e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)
        if(value) {
            axios.post('/edit-item', {text: value, id: e.target.getAttribute("data-id")})
            .then(res => {
                console.log(res.data);
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = value
            }
            )
            .catch(err => {
                console.log(err)
            })
        }
    }
})

document.addEventListener('click', function(e) {
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

document.getElementById("formTodo").addEventListener("submit", function(e) {
    e.preventDefault()
    let inputTodo = document.getElementById("inputTodo")
    let listTodo = document.getElementById("listTodo")
    if(inputTodo.value) {
        axios.post('/create-item', {text: inputTodo.value})
        .then(res => {
            console.log(res.data)
            let HTML = `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${inputTodo.value}</span>
            <div>
            <button data-id="${res.data.insertedId}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${res.data.insertedId}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`
            listTodo.insertAdjacentHTML('beforeend', HTML)
            inputTodo.value = ""
            inputTodo.focus()
        })
        .catch(err => {
            console.log(err)
        })
        
    }
})