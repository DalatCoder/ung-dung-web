from flask import Flask, jsonify, request
from datetime import datetime

import mysql.connector
from mysql.connector import Error

from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


def response_helper(status, data, message, code):
    response_data = {
        'status': status,
        'data': data,
        'msg': message
    }

    response = jsonify(response_data)
    response.headers.add("Content-Type", "application/json")

    return response, code


@app.route('/api/v1/todos')
def get_todos():
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='todos',
                                             user='root',
                                             password='')
        if connection.is_connected():
            sql_select_Query = 'SELECT * FROM todos'
            cursor = connection.cursor()
            cursor.execute(sql_select_Query)

            records = cursor.fetchall()
            todos = []

            for row in records:
                todo = {
                    'id': row[0],
                    'user_id': row[1],
                    'title': row[2],
                    'content': row[3],
                    'completed_at': None if row[4] is None else str(row[4]),
                    'created_at': str(row[5])
                }

                todos.append(todo)

            return response_helper('success', todos, 'Lấy danh sách công việc thành công', 200)

    except Error as e:
        return response_helper('error', None, 'Lỗi trong quá trình kết nối CSDL', 500)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/v1/todos/detail/<int:id>')
def get_todo(id):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='todos',
                                             user='root',
                                             password='')
        if connection.is_connected():
            sql_select_Query = 'SELECT * FROM todos WHERE id = %s'
            cursor = connection.cursor()
            cursor.execute(sql_select_Query, (id,))

            record = cursor.fetchone()
            if record is None:
                return response_helper('fail', None, 'Không tìm thấy công việc', 404)

            todo = {
                'id': record[0],
                'user_id': record[1],
                'title': record[2],
                'content': record[3],
                'completed_at': None if record[4] is None else str(record[4]),
                'created_at': str(record[5])
            }

            return response_helper('success', todo, 'Lấy công việc thành công', 200)

    except Error as e:
        return response_helper('error', None, 'Lỗi trong quá trình kết nối CSDL', 500)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/v1/todos/create', methods=['POST'])
def add_todo():
    new_todo = request.get_json()

    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='todos',
                                             user='root',
                                             password='')
        if connection.is_connected():
            sql_select_Query = 'INSERT INTO todos(title, content) VALUES (%s, %s)'
            cursor = connection.cursor()
            cursor.execute(sql_select_Query,
                           (new_todo['title'], new_todo['content']))
            connection.commit()

            new_todo_id = cursor.lastrowid

            select_query = 'SELECT * FROM todos WHERE id = ' + str(new_todo_id)
            cursor = connection.cursor()
            cursor.execute(select_query)

            record = cursor.fetchone()
            if record is None:
                return response_helper('fail', None, 'Không tìm thấy công việc', 404)

            todo = {
                'id': record[0],
                'user_id': record[1],
                'title': record[2],
                'content': record[3],
                'completed_at': None if record[4] is None else str(record[4]),
                'created_at': str(record[5])
            }

            return response_helper('success', todo, 'Tạo công việc thành công', 201)

    except Error as e:
        return response_helper('error', None, 'Lỗi trong quá trình kết nối CSDL', 500)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/v1/todos/update/<int:id>', methods=['PUT'])
def update_todo(id):
    updated_todo = request.get_json()
    title = updated_todo['title']
    content = updated_todo['content']

    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='todos',
                                             user='root',
                                             password='')
        if connection.is_connected():
            sql_select_Query = 'UPDATE todos SET title = %s, content = %s WHERE id = %s'
            cursor = connection.cursor()
            cursor.execute(sql_select_Query,
                           (title, content, id))
            connection.commit()

            new_todo_id = cursor.lastrowid

            select_query = 'SELECT * FROM todos WHERE id = ' + str(id)
            cursor = connection.cursor()
            cursor.execute(select_query)

            record = cursor.fetchone()
            if record is None:
                return response_helper('fail', None, 'Không tìm thấy công việc', 404)

            todo = {
                'id': record[0],
                'user_id': record[1],
                'title': record[2],
                'content': record[3],
                'completed_at': None if record[4] is None else str(record[4]),
                'created_at': str(record[5])
            }

            return response_helper('success', todo, 'Cập nhật công việc thành công', 201)

    except Error as e:
        return response_helper('error', None, 'Lỗi trong quá trình kết nối CSDL', 500)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/v1/todos/complete/<int:id>', methods=['PUT'])
def make_todo_complete(id):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='todos',
                                             user='root',
                                             password='')
        if connection.is_connected():
            sql_select_Query = 'UPDATE todos SET completed_at = NOW() WHERE id = %s'
            cursor = connection.cursor()
            cursor.execute(sql_select_Query, (id, ))
            connection.commit()

            new_todo_id = cursor.lastrowid

            select_query = 'SELECT * FROM todos WHERE id = ' + str(id)
            cursor = connection.cursor()
            cursor.execute(select_query)

            record = cursor.fetchone()
            if record is None:
                return response_helper('fail', None, 'Không tìm thấy công việc', 404)

            todo = {
                'id': record[0],
                'user_id': record[1],
                'title': record[2],
                'content': record[3],
                'completed_at': None if record[4] is None else str(record[4]),
                'created_at': str(record[5])
            }

            return response_helper('success', todo, 'Cập nhật trạng thái công việc thành công', 200)

    except Error as e:
        return response_helper('error', None, e.msg, 500)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/v1/todos/incomplete/<int:id>', methods=['PUT'])
def make_todo_incomplete(id):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='todos',
                                             user='root',
                                             password='')
        if connection.is_connected():
            sql_select_Query = 'UPDATE todos SET completed_at = NULL WHERE id = %s'
            cursor = connection.cursor()
            cursor.execute(sql_select_Query, (id, ))
            connection.commit()

            new_todo_id = cursor.lastrowid

            select_query = 'SELECT * FROM todos WHERE id = ' + str(id)
            cursor = connection.cursor()
            cursor.execute(select_query)

            record = cursor.fetchone()
            if record is None:
                return response_helper('fail', None, 'Không tìm thấy công việc', 404)

            todo = {
                'id': record[0],
                'user_id': record[1],
                'title': record[2],
                'content': record[3],
                'completed_at': None if record[4] is None else str(record[4]),
                'created_at': str(record[5])
            }

            return response_helper('success', todo, 'Cập nhật trạng thái công việc thành công', 201)

    except Error as e:
        return response_helper('error', None, 'Lỗi trong quá trình kết nối CSDL', 500)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/api/v1/todos/delete/<int:id>', methods=['DELETE'])
def delete_todo(id):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='todos',
                                             user='root',
                                             password='')
        if connection.is_connected():
            sql_select_Query = 'DELETE FROM todos WHERE id = %s'
            cursor = connection.cursor()
            cursor.execute(sql_select_Query, (id, ))
            connection.commit()

            return response_helper('success', None, 'Xóa công việc thành công', 200)

    except Error as e:
        return response_helper('error', None, 'Lỗi trong quá trình kết nối CSDL', 500)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


if __name__ == '__main__':
    app.run(debug=True, port=5000)
