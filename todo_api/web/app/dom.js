const DOMElement = (function () {
  const modal = document.getElementById('modal')
  const modalTitle = document.getElementById('modal-title')
  const modalSubmitButton = document.getElementById('submit-modal-button')
  const modalCloseButton = document.getElementById('close-modal-button')
  const todoTitle = document.getElementById('todo-title')
  const todoContent = document.getElementById('todo-content')

  const modalInstance = bootstrap.Modal.getOrCreateInstance(modal)

  const openTodoCreateModalButton = document.getElementById('open-todo-modal-button')

  return {
    modal: {
      modal,
      modalInstance,
      modalTitle,
      modalSubmitButton,
      modalCloseButton,
      todoTitle,
      todoContent,
    },
    openTodoCreateModalButton
  }
})()
