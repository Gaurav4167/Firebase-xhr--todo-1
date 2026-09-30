var cl = console.log;

const BASE_URL = `https://gaurav-1st-db-default-rtdb.firebaseio.com/`;
const TODO_URL = `${BASE_URL}/todos.json`;

const todos = [];

const todoForm = document.getElementById("todoForm")
const inputControl = document.getElementById("inputControl")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const addTodoCard = document.getElementById("addTodoCard")
const spinner = document.getElementById("spinner")

//=============================== READ ======================================
function fetceTodo() {
    let xhr = new XMLHttpRequest()
    showSpinner("text-primary")
    xhr.open("GET", TODO_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            for (const key in res) {
                res[key].id = key
                todos.unshift(res[key])
            }
            for (const key in res) {
                let result = "";
                result = `<ul id=${res[key].id} class="list-group mb-2">
                            <li class="list-group-item d-flex justify-content-between align-item-center"><strong> ${res[key].todo} </strong>
                        <div>
                            <i onClick="editTodo(this)" id="editBtn" role="button" class="fa-solid fa-pen-to-square text-primary"></i>
                            <i onClick="removeTodo(this)" id="deleteBtn" role="button" class="fa-solid fa-trash-can text-danger ml-4"></i>
                        </div>
                        </li>
                        </ul>`
                addTodoCard.innerHTML += result
                hideSpinner("text-primary")
            }
        } else {
            cl("Something went wrong")
        }
    }
}
fetceTodo()
//=============================== CREATE ======================================
function createTodo(eve) {
    eve.preventDefault()
    let newTodo = {
        todo: inputControl.value
    }

    let xhr = new XMLHttpRequest()
    showSpinner("text-success")
    xhr.open("POST", TODO_URL)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Token", "JWT FROM LS")
    xhr.send(JSON.stringify(newTodo))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            let ul = document.createElement("ul")
            ul.id = res.name
            ul.className = "list-group mb-2";
            ul.innerHTML = `  <li class="list-group-item d-flex justify-content-between align-item-center"><img id="flower-img" src="./assets/images/flower2.png" alt=""><strong> ${newTodo.todo} </strong>
                        <div>
                            <i onClick="editTodo(this)" id="editBtn" role="button" class="fa-solid fa-pen-to-square text-primary"></i>
                            <i onClick="removeTodo(this)" id="deleteBtn" role="button" class="fa-solid fa-trash-can text-danger ml-4"></i>
                        </div>
                        </li>`

            addTodoCard.prepend(ul)
            todoForm.reset()
            hideSpinner("text-success")
            showSnackBar("Added!", "Todo Added Successfully!!!")
        } else {
            cl("Something went wrong")
        }
    }
}

//=============================== EDIT ======================================
function editTodo(ele) {
    let EDIT_ID = ele.closest("ul").id


    let EDIT_URL = `${BASE_URL}/todos/${EDIT_ID}.json`
    let xhr = new XMLHttpRequest()
    showSpinner("text-success")
    xhr.open("GET", EDIT_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            localStorage.setItem("EDIT_ID", EDIT_ID)

            inputControl.value = res.todo
            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
            hideSpinner("text-success")
        } else {
            cl("Something went wrong")
        }
    }
}
//=============================== UPDATE ======================================
function updateTodo(eve) {
    let UPADATE_ID = localStorage.getItem("EDIT_ID")
    localStorage.removeItem("EDIT_ID")

    let UPDATE_URL = `${BASE_URL}/todos/${UPADATE_ID}.json`

    let updatedTodo = {
        todo: inputControl.value,
        id: UPADATE_ID
    }

    let xhr = new XMLHttpRequest()
    showSpinner("text-success")
    xhr.open("PATCH", UPDATE_URL)
    xhr.send(JSON.stringify(updatedTodo))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            // cl(res)
            let getIndex = todos.findIndex(ele => ele.id === UPADATE_ID)
            todos[getIndex] = updatedTodo

            document.getElementById(UPADATE_ID).innerHTML = ` 
                            <li class="list-group-item d-flex justify-content-between align-item-center"><strong> ${res.todo} </strong>
                                 <div>
                                   <i onClick="editTodo(this)" id="editBtn" role="button" class="fa-solid fa-pen-to-square text-primary"></i>
                                  <i onClick="removeTodo(this)" id="deleteBtn" role="button" class="fa-solid fa-trash-can text-danger ml-4"></i>
                                 </div>
                             </li>`
            updateBtn.classList.add("d-none")
            addBtn.classList.remove("d-none")
            todoForm.reset()
            hideSpinner("text-success")
            showSnackBar("Updated!", "Todo Updated Successfully!!!")
        } else {
            cl("Something went wrong")
        }
    }
}
//=============================== DELETE ======================================
function removeTodo(ele) {
    let DELETE_ID = ele.closest("ul").id
    let DELETE_URL = `${BASE_URL}/todos/${DELETE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "It delete permanently",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let xhr = new XMLHttpRequest()
            showSpinner("text-danger")
            xhr.open("DELETE", DELETE_URL)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response)
                    let getIndex = todos.findIndex(ele => ele.id === DELETE_ID)
                    todos.splice(getIndex, 1)
                    ele.closest("ul").remove()
                    hideSpinner("text-danger")
                    showSnackBar("Deleted!", "Todo Deleted Successfully!!!")

                } else {
                    cl("Something went wrong")
                }
            }
        }
    });

}
function showSnackBar(title, msg) {
    Swal.fire({
        title: title,
        text: msg,
        icon: "success"
    });
}
function showSpinner(color){
    spinner.classList.remove("d-none")
    spinner.classList.add(color)
}
function hideSpinner(color){
    spinner.classList.add("d-none")
    spinner.classList.remove(color)

}
todoForm.addEventListener("submit", createTodo)
updateBtn.addEventListener("click", updateTodo)




























