//enfoque basico de conexion
//mostrar los datos de un usuario por su nombre

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "practica2",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la base de datos!!");
  connection.query("SELECT * FROM dato", (err, results, fields) => {
    if (err) throw err;
    for (let i = 0; i <= results.length - 1; i++) {
      if (results[i].name == "Pedro") console.log(results[i]);
    }
  });
  connection.end();
}); 
//usando promesas
/* const mysql = require("mysql2/promise");

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "testdb",
    });
    console.log("Conectado a la base de datos");
    const [rows, fields] = await connection.execute("SELECT * FROM users");

    for(let i=0;i<=rows.length-1;i++){
      if(rows[i].name=="Sebastian"){
        console.log(rows[i])
      }
    }

    await connection.end();
  } catch (err) {
    console.log(err);
  }
}
main(); */
//usando el agrupamiento de conexiones
/* const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.query("SELECT * FROM users", (err, results, fields) => {
  if (err) throw err;
  console.log(results);
});
 */

//practica
const express = require("express");
const mysql = require("mysql");
const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_user",
});

db.connect((error) => {
  if (error) {
    console.error("error al conectar a la base de datos", error);
  } else {
    console.log("conectado correctamente");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post("/guardar", (req, res) => {
  const { nombre } = req.body;
  db.query("INSERT INTO user(nombre) VALUES(?)", [nombre], (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "error al guardar" });
    }
    res.status(200).json({ success: true });
  });
});

app.get("/datos", (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "error al obtener datos" });
      return;
    }
    console.log(result);
    res.json(result);
  });
});

app.delete("/elim/id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM user WHERE id=?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "error al eliminar datos" });
      return;
    }
    console.log("hola")
    res.json({ message: "usuario eliminado con exito" });
  });
});


app.put("/actualizar/id", (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  db.query("UPDATE user SET nombre=? WHERE id=?", [nombre, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "error al actualizar usuario" });
      return;
    }
    res.json({ message: "los datos del usuario ahn sido actualizados" });
  });
});


app.listen(3000, () => {
  console.log("servidor listo en el puerto http://localhost:3000");
});

process.on("SIGINT", () => {
  db.end();
  process.exit();
});
