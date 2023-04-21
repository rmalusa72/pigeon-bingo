const express = require("express");
const app = express();
const port = 3000;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test"); // similar to CREATE DATABASE
makeUserTable();

/**
 * Creates new table to store users and messes around with its contents.
 *
 * @return None
 */
function makeUserTable() {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users;");
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);");
    db.run("INSERT INTO users VALUES (1, 'ruby');");
    db.run("INSERT INTO users VALUES (2, 'lee');");
    db.run("INSERT INTO users (name) VALUES ('claire');");
    //db.run("UPDATE users SET name = 'the blob'");
    db.run("UPDATE users SET name='erin' WHERE name='claire';");
    db.run("UPDATE users SET name='claire' WHERE id='3';");
    db.run("DELETE FROM users WHERE name='claire';");

    // const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (let i = 0; i < 10; i++) {
    //   stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    db.each("SELECT id AS id, name FROM users", (err, row) => {
      console.log(row.id + ": " + row.name);
    });
  });
}

/**
 * Creates or opens table "lorem" and adds ten numbered elements.
 *
 * @return None
 */
function databaseExample() {
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
      console.log(row.id + ": " + row.info);
    });
  });
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  db.close();
  console.log(`Helpful pigeon is listening on port ${port}`);
});
