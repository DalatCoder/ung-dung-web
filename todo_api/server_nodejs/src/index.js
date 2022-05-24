const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mysql = require('mysql')
const { responseHelper } = require('./utils')

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todos'
}

// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/api/v1/todos', (req, res) => {
  const connection = mysql.createConnection(mysqlConfig)

  let sql = `SELECT * FROM todos`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      responseHelper(res, "fail", null, error.message, 400)
      return
    }

    responseHelper(res, "success", results, "Lấy danh sách công việc thành công", 200)
  });
  connection.end();
});

app.get('/api/v1/todos/detail/:id', (req, res) => {
  const todoId = req.params.id

  const connection = mysql.createConnection(mysqlConfig)

  let sql = `SELECT * FROM todos WHERE id = ${todoId}`

  connection.query(sql, (error, results, fields) => {
    if (error) {
      responseHelper(res, "fail", null, error.message, 400)
      return
    }

    if (results.length > 0) {
      responseHelper(res, "success", results[0], "Lấy công việc thành công", 200)
      return
    }

    responseHelper(res, "fail", null, "Không tìm thấy công việc", 404)
  });
  connection.end();
});

app.post('/api/v1/todos/create', (req, res) => {
  const todo = req.body
  const title = todo.title || ''
  const content = todo.content || ''

  if (title.length == 0) {
    responseHelper(res, "fail", null, "Vui lòng nhập tiêu đề", 400)
    return
  }

  const connection = mysql.createConnection(mysqlConfig)

  let sql = `INSERT INTO todos(title, content) VALUES ('${title}', '${content}')`

  connection.query(sql, (error, results, fields) => {
    if (error) {
      responseHelper(res, "fail", null, error.message, 400)
      return
    }

    const newTodoId = results.insertId
    if (newTodoId <= 0) {
      responseHelper(res, "fail", null, "Có lỗi trong quá trình tạo công việc mới", 500)
      return
    }

    let querySql = `SELECT * FROM todos WHERE id = ${newTodoId}`
    connection.query(querySql, (error, results, fields) => {
      if (error) {
        responseHelper(res, "fail", null, error.message, 400)
        return
      }

      if (results.length > 0) {
        responseHelper(res, "success", results[0], "Lấy công việc thành công", 200)
        return
      }

      responseHelper(res, "fail", null, "Không tìm thấy công việc", 404)
    })
    connection.end()
  });
})

app.put('/api/v1/todos/update/:id', (req, res) => {
  const todoId = req.params.id
  const updatedTodo = req.body

  const title = updatedTodo.title || ''
  const content = updatedTodo.content || ''

  if (title.length == 0) {
    responseHelper(res, 'fail', null, 'Vui lòng nhập tiêu đề', 400)
    return
  }

  const connection = mysql.createConnection(mysqlConfig)

  let sql = `UPDATE todos SET title = '${title}', content = '${content}' WHERE id = ${todoId}`

  connection.query(sql, (error, results, fields) => {
    if (error) {
      responseHelper(res, "fail", null, error.message, 400)
      return
    }

    if (results.affectedRows == 0) {
      responseHelper(res, 'fail', null, 'Không tìm thấy công việc', 404)
      return
    }

    let querySql = `SELECT * FROM todos WHERE id = ${todoId}`
    connection.query(querySql, (error, results, fields) => {
      if (error) {
        responseHelper(res, "fail", null, error.message, 400)
        return
      }

      if (results.length > 0) {
        responseHelper(res, "success", results[0], "Cập nhật công việc thành công", 200)
        return
      }

      responseHelper(res, "fail", null, "Không tìm thấy công việc", 404)
    })
    connection.end()
  });
})

app.put('/api/v1/todos/complete/:id', (req, res) => {
  const todoId = req.params.id

  const connection = mysql.createConnection(mysqlConfig)

  let sql = `UPDATE todos SET completed_at = now() WHERE id = ${todoId}`

  connection.query(sql, (error, results, fields) => {
    if (error) {
      responseHelper(res, "fail", null, error.message, 400)
      return
    }
    const affectedRows = results.affectedRows
    if (affectedRows > 0) {
      let querySql = `SELECT * FROM todos WHERE id = ${todoId}`
      connection.query(querySql, (error, results, fields) => {
        if (error) {
          responseHelper(res, "fail", null, error.message, 400)
          return
        }

        if (results.length > 0) {
          responseHelper(res, "success", results[0], "Đánh dấu công việc hoàn thành thành công", 200)
          return
        }

        responseHelper(res, "fail", null, "Không tìm thấy công việc", 404)
      })
    }
    else {
      responseHelper(res, "fail", null, "Không tìm thấy công việc", 404)
    }

    connection.end()
  });
})

app.put('/api/v1/todos/incomplete/:id', (req, res) => {
  const todoId = req.params.id

  const connection = mysql.createConnection(mysqlConfig)

  let sql = `UPDATE todos SET completed_at = NULL WHERE id = ${todoId}`

  connection.query(sql, (error, results, fields) => {
    if (error) {
      responseHelper(res, "fail", null, error.message, 400)
      return
    }
    const affectedRows = results.affectedRows
    if (affectedRows > 0) {
      let querySql = `SELECT * FROM todos WHERE id = ${todoId}`
      connection.query(querySql, (error, results, fields) => {
        if (error) {
          responseHelper(res, "fail", null, error.message, 400)
          return
        }

        if (results.length > 0) {
          responseHelper(res, "success", results[0], "Bỏ đánh dấu công việc hoàn thành thành công", 200)
          return
        }

        responseHelper(res, "fail", null, "Không tìm thấy công việc", 404)
      })
    }
    else {
      responseHelper(res, "fail", null, "Không tìm thấy công việc", 404)
    }
  });
})

app.delete('/api/v1/todos/delete/:id', (req, res) => {
  const todoId = req.params.id

  const connection = mysql.createConnection(mysqlConfig)

  let sql = `DELETE FROM todos WHERE id = ${todoId}`

  connection.query(sql, (error, results, fields) => {
    if (error) {
      responseHelper(res, "fail", null, error.message, 400)
      return
    }
    const affectedRows = results.affectedRows
    if (affectedRows > 0) {
      responseHelper(res, "success", null, "Xóa công việc thành công", 200)
    }
    else {
      responseHelper(res, "fail", null, "Không tìm thấy công việc cần xóa", 404)
    }
  });

  connection.end()
})

// starting the server
app.listen(5000, () => {
  console.log('listening on port 5000');
});
