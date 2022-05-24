const ServiceModule = (function () {
  async function getTodos() {
    const stream = await fetch(`${AppData.base_api_url}/api/todo`, {
      headers: {
        'Content-Type': 'application/json',
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

    const stream = await fetch(`${AppData.base_api_url}/api/todo/create`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
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
    let apiUrl = `${AppData.base_api_url}/api/todo/complete/${todoId}`
    if (newStatus == false)
      apiUrl = `${AppData.base_api_url}/api/todo/incomplete/${todoId}`

    const stream = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
    const stream = await fetch(`${AppData.base_api_url}/api/todo/delete/${todoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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
      title: title,
      content: content
    }

    const stream = await fetch(`${AppData.base_api_url}/api/todo/update/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
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
