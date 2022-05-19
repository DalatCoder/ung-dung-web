window.addEventListener('DOMContentLoaded', async function () {
  try {
    await ServiceModule.getTodos()

    UIRender.buildTodoList(handleOnTodoStatusChange, handleOnTodoEditClick, handleOnTodoTrashClick)
    UIRender.paginate()
  }
  catch (e) {
    if (e.message == 'Unexpected token C in JSON at position 0') {
      alert('Lỗi hệ thống, vui lòng thử lại sau')
    }
    else {
      alert(e.message)
    }
  }

  DOMElement.openTodoCreateModalButton.addEventListener('click', function () {
    AppData.modalType = 'create'
    UIRender.resetModalFieldValue()
    UIRender.showModal()
  })

  DOMElement.modal.modalSubmitButton.addEventListener('click', async function (e) {
    if (AppData.modalType == 'create') {
      createNewTodo()
    }
    else if (AppData.modalType == 'update') {
      updateTodo()
    }

    async function createNewTodo() {
      const title = DOMElement.modal.todoTitle.value || ''
      const content = DOMElement.modal.todoContent.value || ''

      try {
        await ServiceModule.createTodo(title, content)

        UIRender.buildTodoList(handleOnTodoStatusChange, handleOnTodoEditClick, handleOnTodoTrashClick)
        UIRender.paginate()

        UIRender.hideModal()
        UIRender.resetModalFieldValue()
      }
      catch (e) {
        if (e.message == 'Unexpected token C in JSON at position 0') {
          alert('Lỗi hệ thống, vui lòng thử lại sau')
        }
        else {
          alert(e.message)
        }
      }
    }

    async function updateTodo() {
      const id = AppData.updatedTodo.id
      const title = DOMElement.modal.todoTitle.value || ''
      const content = DOMElement.modal.todoContent.value || ''

      try {
        await ServiceModule.updateTodo(id, title, content)

        UIRender.buildTodoList(handleOnTodoStatusChange, handleOnTodoEditClick, handleOnTodoTrashClick)
        UIRender.hideModal()
        UIRender.resetModalFieldValue()
      }
      catch (e) {
        if (e.message == 'Unexpected token C in JSON at position 0') {
          alert('Lỗi hệ thống, vui lòng thử lại sau')
        }
        else {
          alert(e.message)
        }
      }
    }
  })

  async function handleOnTodoStatusChange(todo, newStatus) {
    try {
      await ServiceModule.changeTodoStatus(todo.id, newStatus)
      UIRender.buildTodoList(handleOnTodoStatusChange, handleOnTodoEditClick, handleOnTodoTrashClick)
    }
    catch (e) {
      if (e.message == 'Unexpected token C in JSON at position 0') {
        alert('Lỗi hệ thống, vui lòng thử lại sau')
      }
      else {
        alert(e.message)
      }
    }
  }

  function handleOnTodoEditClick(todo) {
    AppData.modalType = 'update'
    AppData.updatedTodo = todo

    DOMElement.modal.todoTitle.value = todo.title || ''
    DOMElement.modal.todoContent.value = todo.content || ''
    UIRender.showModal()
  }

  async function handleOnTodoTrashClick(todo) {
    try {
      await ServiceModule.trashTodo(todo.id)
      UIRender.buildTodoList(handleOnTodoStatusChange, handleOnTodoEditClick, handleOnTodoTrashClick)
      UIRender.paginate()
    }
    catch (e) {
      if (e.message == 'Unexpected token C in JSON at position 0') {
        alert('Lỗi hệ thống, vui lòng thử lại sau')
      }
      else {
        alert(e.message)
      }
    }
  }
})
