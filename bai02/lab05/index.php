<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>

<body>
  <table style="display: none;">
    <thead>
      <th>Ho ten</th>
      <th>Email</th>
      <th>Diem</th>
    </thead>
    <tbody id="danhsachsinhvien"></tbody>
  </table>

  <form action="login.php" method="post">
    <div>
      <label for="email">Email:</label>
      <input type="email" name="email" id="email">
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" name="password" id="password">
    </div>
    <hr>
    <input type="submit" name="submit" value="Login">
  </form>

  <div id="result"></div>

  <script>
    const form = document.querySelector('form')
    const resultElement = document.getElementById('result')

    form.addEventListener('submit', e => {
      e.preventDefault()

      const data = {
        'email': document.getElementById('email').value,
        'password': document.getElementById('password').value
      }

      fetch('login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
          resultElement.innerHTML = JSON.stringify(data)
        })
        .catch(err => console.log(err))

    })
  </script>

  <script>
    const tbody = document.getElementById('danhsachsinhvien');

    fetch('get_students.php')
      .then((res) => res.json())
      .then((data) => {

        for (const item of data) {
          const tr = `
            <tr>
              <td>${item.name}</td>
              <td>${item.email}</td>
              <td>${item.diem}</td>
            </tr>
          `

          tbody.insertAdjacentHTML('beforeend', tr)
        }
      })
      .catch((err) => console.log(err));
  </script>
</body>

</html>
