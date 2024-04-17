const serverLink = "http://localhost:9090/api";

document.addEventListener("DOMContentLoaded", checkToken);

async function checkToken() {
    const token = getCookie("token");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }
    try{
        const res = await fetch(`${serverLink}/user/check`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            console.error('Failed to call API');
            window.location.href = "/login.html";
            return;
        }
        const data = await res.json();
        if (!data.status) {
            window.location.href = "/login.html";
        }
        document.getElementById("userName").innerText = data.message.name
    }
    catch(error){
        window.location.href = "/login.html";
    } 
}

function getCookie(name) {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}


const tasks = document.getElementById('tasks');
const deletePopup = document.getElementById('deletePopup');
const editPopup = document.getElementById('editPopup');
const addPopup = document.getElementById('addPopup');
const onePopup = document.getElementById('onePopup');
const closeBtnEdit = document.getElementById('closeBtnEdit');
const closeBtnDelete = document.getElementById('closeBtnDelete');
const closeBtnAdd = document.getElementById('closeBtnAdd');
const closeBtnOne = document.getElementById('closeBtnOne');
const logoutBtn = document.getElementById('logoutBtn');

const cancelBtn = document.getElementById('cancelBtn');
const cancelBtnEdit = document.getElementById('cancelBtnEdit');
const cancelBtnAdd = document.getElementById('cancelBtnAdd');


closeBtnEdit.addEventListener('click', () => { closePopup(editPopup) })
closeBtnOne.addEventListener('click', () => { closePopup(onePopup) })
closeBtnDelete.addEventListener('click', () => { closePopup(deletePopup) })
closeBtnAdd.addEventListener('click', () => { closePopup(addPopup) })
cancelBtn.addEventListener('click', () => { closePopup(deletePopup) })
cancelBtnEdit.addEventListener('click', () => { closePopup(editPopup) })
cancelBtnAdd.addEventListener('click', () => { closePopup(addPopup) })
logoutBtn.addEventListener('click', logoutUser)


deletePopup.addEventListener('click', function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

onePopup.addEventListener('click', function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

editPopup.addEventListener('click', function (event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

onload = showTodos();

async function showTodos() {
    const todos = await getTodos();
    if (!todos.status) return;
    todos.message.forEach(todo => {
        const checkStatus = (todo.completed) ? "checked" : "";
        const isCompleted = (todo.completed) ? "completed" : "";
        const task = `
        <div class="task">
            <input type="checkbox" ${checkStatus} disabled/>
            <div class="task-details ${isCompleted}" onclick="showOneTodo('${todo.title}', '${todo.description}', '${todo.completed}')">
                <div class="title">${todo.title}</div>
                <span class="separator">|</span>
                <div class="desc">${todo.description} 1</div>
            </div>
            <div class="task-actions">
                <div class="action-img-holder"><img class="action-img" src="./images/edit.png" onclick="showEditTodo('${todo._id}', '${todo.title}', '${todo.description}', '${todo.completed}')"/></div>
                <div class="action-img-holder"><img class="action-img" src="./images/delete.png" onclick="deleteTodo('${todo._id}', '${todo.title}')"/></div>
            </div>
        
        </div>
        `;
        tasks.innerHTML += task;
    });
}


function closePopup(element) {
    element.style.display = 'none';
}

function logoutUser(){
    document.cookie = "token=none; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login.html";
}

function showAddTodo() {
    addPopup.style.display = 'flex';
}

async function addTodo() {
    const addTitle = document.getElementById('addTitle').value;
    const addDescription = document.getElementById('addDescription').value;
    if (addTitle.trim() == "" || addDescription.trim() == "") {
        alert("Fill all fields please.");
        return;
    }
    callAPI("/todo/add", "POST", { title: addTitle, description: addDescription }, addPopup);
}

async function editTodo() {
    const id = document.getElementById("todoId").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const isCompletedCheckbox = document.getElementById("isCompletedCheckbox").checked;

    if (title.trim() == "" || description.trim() == "") {
        alert("Fill all fields please.");
        return;
    }
    callAPI("/todo/update", "PATCH", { id: id, title: title, description: description, completed: isCompletedCheckbox }, editPopup);
}

let editBtnClickHandler = null;

function showEditTodo(id, title, description, completed) {
    editPopup.style.display = 'flex';
    const todoId = document.getElementById("todoId");
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const isCompletedCheckbox = document.getElementById("isCompletedCheckbox");
    todoId.value = id;
    titleInput.value = title;
    descriptionInput.value = description;
    isCompletedCheckbox.checked = (completed == "true");
}

function showOneTodo(title, description, completed) {
    onePopup.style.display = 'flex';
    document.getElementById("oneTitle").innerText = title;;
    document.getElementById("oneDescription").innerText = description;
    document.getElementById("oneCheck").checked = (completed == "true");
    document.getElementById("oneCheckText").innerText = (completed == "true") ? "Completed" : "Not Completed";
}

let deleteBtnClickHandler = null;

async function deleteTodo(id, title) {
    deletePopup.style.display = 'flex';
    document.getElementById("deleteTitle").innerText = title;
    if (deleteBtnClickHandler) {
        document.getElementById("deleteBtn").removeEventListener("click", deleteBtnClickHandler);
    }
    deleteBtnClickHandler = async () => {
        callAPI("/todo/delete", "DELETE", { id }, deletePopup);
    };
    document.getElementById("deleteBtn").addEventListener("click", deleteBtnClickHandler);
}


async function getTodos() {
    const token = getCookie("token");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }
    const res = await fetch(`${serverLink}/todo/todos`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) {
        return false;
    }
    return await res.json();
}


async function callAPI(apiLink, apiMethod, apiData, popupToHide = null) {
    const token = getCookie("token");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }
    const res = await fetch(`${serverLink}${apiLink}`, {
        method: apiMethod,
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(apiData),
    });
    if (!res.ok) {
        console.error('Failed to call API');
        return false;
    }
    const data = await res.json();
    if (popupToHide) popupToHide.style.display = 'none';
    tasks.innerHTML = '';
    await showTodos();
    return true;
}