import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const user = async () => {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  //create user
  const createUser = async () => {
    await db.run(`CREATE TABLE IF NOT EXISTS user (user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT NOT NULL, password TEXT NOT NULL);`);
  };

  //insert user by passing data in the url
  const insertUser = async (props) => {
    if (!props || !props.name || !props.password) {
      throw new Error(`you must provide a name and an password`);
    }
    const { name, password } = props;
    try {
      const result = await db.run(
        SQL`INSERT INTO "main"."user"
            ("username", "password")
            VALUES (${name}, ${password});`
      );
    } catch (e) {
      throw new Error(`couldn't insert this combination: ` + e.message);
    }
  };

  const updateUser = async (iduser, props) => {
    if (!props || !props.username || !props.password) {
      throw new Error(`you must provide a username and an password`);
    }
    const { username, password } = props;
    try {
      const res = await db.run(
        `UPDATE user
          SET username='${username}', password='${password}'
          WHERE user_id=${iduser};`
      );
    } catch (e) {
      throw new Error(`couldn't update this user: ` + e.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await db.run(`DELETE FROM user WHERE user_id=${id}`);
      if (result.stmt.changes === 0) {
        throw new Error(`contact "${id}" does not exist`);
      }
      return true;
    } catch (e) {
      throw new Error(`couldn't delete the contact "${id}": ` + e.message);
    }
  };

  const getUser = async () => {
    try {
      const s = await db.all(SQL`SELECT * FROM user`);
      if (!s) {
        throw new Error("user not found");
      }
      return s;
    } catch (e) {
      throw new Error("Cannot get the user" + e.message);
    }
  };

  const getUserById = async (id) => {
    try {
      const userslist = await db.all(
        SQL`SELECT user_id AS id, username FROM user WHERE user_id = ${id}`
      );
      const us = userslist[0];
      if (!us) {
        throw new Error(`user ${id} not found`);
      }
      return us;
    } catch (e) {
      throw new Error(`couldn't get the user ${id}: ` + e.message);
    }
  };

  const controller = {
    createUser,
    insertUser,
    updateUser,
    deleteUser,
    getUser,
    getUserById,
  };

  return controller;
};

export default user;
