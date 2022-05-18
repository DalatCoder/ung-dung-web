const ServiceModule = (function () {
  async function getTodos() {
    const stream = await fetch(`${AppData.base_api_url}/todo/get.php`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    const response = await stream.json()

    if (response.status == 'success') {
      AppData.todos = response.data
      AppData.total = response.data.length

      return response.data
    }

    throw new Error(response.msg)
  }

  async function createTodo(title, content) {
    const data = {
      title,
      content
    }

    const stream = await fetch(`${AppData.base_api_url}/todo/create.php`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    const response = await stream.json()

    if (response.status == 'success') {
      AppData.todos = [...AppData.todos, response.data]
      AppData.total += 1

      return response.data
    }

    throw new Error(response.msg)
  }

  async function changeTodoStatus(todoId, newStatus) {
    const data = {
      id: todoId,
      status: newStatus
    }

    const stream = await fetch(`${AppData.base_api_url}/todo/change_status.php`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    const response = await stream.json()

    if (response.status == 'success') {
      AppData.todos = AppData.todos.map(t => t.id == response.data.id ? response.data : t)

      return response.data
    }

    throw new Error(response.msg)
  }

  async function trashTodo(todoId) {
    const data = {
      id: todoId
    }

    const stream = await fetch(`${AppData.base_api_url}/todo/delete.php`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    const response = await stream.json()

    if (response.status == 'success') {
      AppData.todos = AppData.todos.filter(t => t.id != todoId)
      AppData.total -= 1

      return response.data
    }

    throw new Error(response.msg)
  }

  async function updateTodo(todoId, title, content) {
    const data = {
      id: todoId,
      title: title,
      content: content
    }

    const stream = await fetch(`${AppData.base_api_url}/todo/update.php`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    const response = await stream.json()

    if (response.status == 'success') {
      AppData.todos = AppData.todos.map(t => t.id == response.data.id ? response.data : t)
      return response.data
    }

    throw new Error(response.msg)
  }

  return {
    getTodos,
    createTodo,
    changeTodoStatus,
    trashTodo,
    updateTodo
  }
})()
