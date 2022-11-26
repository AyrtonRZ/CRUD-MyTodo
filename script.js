const tbody = document.querySelector('#tbody')

async function getTasks() {
    const response = await fetch('https://api.vitorfigueiredo.com/controllers/list-tasks.php')
    const data = await response.json()

    const results = data.tasks

    for(const item of results) {
        const name = item.name
        const description = item.description
        const idTask = item.id

        const tr = document.createElement('tr')
        tbody.appendChild(tr)

        const columnName = document.createElement('td')
        columnName.innerText = name
        columnName.style.color = name == 'Não' && 'red' 
        columnName.style.fontWeight = name == 'Não' && 'bold'
        tr.appendChild(columnName)

        const columnDescription = document.createElement('td')
        columnDescription.innerText = description
        tr.appendChild(columnDescription)

        const columnButtons = document.createElement('td')
        tr.appendChild(columnButtons)

        const buttonDelete = document.createElement('button')
        buttonDelete.innerText = 'Delete'
        buttonDelete.setAttribute('class', 'buttonDelete')
        buttonDelete.setAttribute('id', 'buttonDeleteTask')
        buttonDelete.addEventListener('click', () => {
            deleteTask(idTask)
            
        })
        columnButtons.appendChild(buttonDelete)
    }
}
getTasks()

async function postTasks() {
    const name = document.getElementById('nomeTarefa').value
    const description = document.getElementById('descricaoTarefa').value

    const body = new FormData()
    body.append('name', name)
    body.append('description', description)

    loadingButton('buttonAdd', 'start')
    const response = await fetch('https://api.vitorfigueiredo.com/controllers/add-task.php', {
        method : 'POST',
        body
    })
    const data = await response.json()
    loadingButton('buttonAdd', 'stop')

    if(response.status === 200) {
        updatePage()
    }
}

async function deleteTask(id) {
    loadingButton('buttonDeleteTask', 'start')
    const response = await fetch(`https://api.vitorfigueiredo.com/controllers/delete-task.php?task_id=${id}`, {
        method : 'DELETE'
    })
    const data = await response.json()
    loadingButton('buttonDeleteTask', 'stop')

    if(response.status === 200) {
        updatePage()
    }
}

function updatePage() {
    tbody.innerHTML = ''
    document.getElementById('nomeTarefa').value = ''
    document.getElementById('descricaoTarefa').value = ''

    getTasks()
}

function loadingButton(idButton, value) {
    const button = document.getElementById(idButton)

    if(value == 'start') {
        button.setAttribute('disabled', true)
        button.innerHTML = ''

        const spinner = document.createElement('div')
        spinner.setAttribute('class', 'spinner-border')
        spinner.setAttribute('role', 'status')
        button.appendChild(spinner)
    }

    if(value == 'stop') {
        button.removeAttribute('disabled')
        button.innerHTML = ''
        button.innerText = 'Criar'
    }    
}