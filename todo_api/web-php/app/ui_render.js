const UIRender = (function () {
  function buildTodoList(onTodoStatusChange, onEditClick, onDeleteClick) {
    const allLi = AppData.todos
      .map(todo => {
        const successClass = todo.completed_at ? 'list-group-item-success' : ''
        const checkedStatus = todo.completed_at ? 'checked' : ''

        const li = document.createElement('li')
        li.classList.add('list-group-item')

        if (successClass) {
          li.classList.add(successClass)
        }

        const createdAtBadge = `<span class="badge bg-info text-light">Tạo lúc: ${todo.created_at}</span>`
        let completedAtBadge = ``

        if (todo.completed_at) {
          completedAtBadge = `<span class="badge bg-success text-light">Hoàn thành lúc: ${todo.completed_at}</span>`
        }

        const html = `
            <div class="row">
              <div class="col-1">
                <input
                  class="form-check-input me-1 todo-check"
                  type="checkbox"
                  id="todo-check-${todo.id}"
                  value="${todo.id}"
                  ${checkedStatus}
                />
              </div>
              <div class="col-9 col-lg-10">
                <h3 class="h5">${todo.title}</h3>
              </div>
              <div class="col-2 col-lg-1 d-flex justify-content-end">
              <button class="btn todo-edit p-0 me-2" id="todo-edit-${todo.id}">
                <i
                  class="text-warning"
                  data-feather="edit"
                ></i>
              </button>
              <button class="btn todo-trash p-0" id="todo-trash-${todo.id}">
                <i
                  class="text-danger"
                  data-feather="trash"
                ></i>
              </button>
              </div>
              <div class="col-12 mt-3 mt-lg-1 text-sm">${todo.content}</div>
              <div class="col-12 mt-3 mt-lg-1 text-sm">
                ${createdAtBadge}
                ${completedAtBadge}
              </div>
            </div>
        `

        li.innerHTML = html
        if (onTodoStatusChange) {
          li.querySelector('#todo-check-' + todo.id).addEventListener('change', function (e) {
            onTodoStatusChange(todo, e.target.checked)
          })
        }

        if (onEditClick) {
          li.querySelector('#todo-edit-' + todo.id).addEventListener('click', function () {
            onEditClick(todo)
          })
        }

        if (onDeleteClick) {
          li.querySelector('#todo-trash-' + todo.id).addEventListener('click', function () {
            onDeleteClick(todo)
          })
        }

        return li
      })

    document.getElementById('todo-list').innerHTML = ''
    document.getElementById('todo-list').append(...allLi)
    feather.replace();
  }

  function hideModal() {
    DOMElement.modal.modalInstance.hide()
  }

  function showModal() {
    if (AppData.modalType == 'create') {
      DOMElement.modal.modalTitle.innerText = 'Tạo công việc mới'
      DOMElement.modal.modalSubmitButton.innerText = 'Tạo mới'

      DOMElement.modal.modalInstance.show()
    }
    else if (AppData.modalType == 'update') {
      DOMElement.modal.modalTitle.innerText = 'Cập nhật công việc mới'
      DOMElement.modal.modalSubmitButton.innerText = 'Cập nhật'

      DOMElement.modal.modalInstance.show()
    }
    else {
      alert('Loại modal không hợp lệ')
    }
  }

  function resetModalFieldValue() {
    DOMElement.modal.todoTitle.value = ''
    DOMElement.modal.todoContent.value = ''
  }

  function paginate() {
    const div = document.createElement('div')
    div.classList.add('container', 'mt-5')

    const paginateItems = []
    let pages = Math.floor(AppData.total / AppData.perPage)

    for (let i = 1; i <= pages; i++) {
      paginateItems.push(`<li class="page-item"><a class="page-link" href="#">${i}</a></li>`)
    }

    const html = `
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-center">
            ${paginateItems.join('')}
          </ul>
        </nav>
    `

    div.innerHTML = html

    document.getElementById('pagination').innerHTML = ''
    document.getElementById('pagination').appendChild(div)
  }

  return {
    buildTodoList,
    showModal,
    hideModal,
    resetModalFieldValue,
    paginate,
  }
})()
