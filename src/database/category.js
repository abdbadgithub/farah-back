import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const category = async () => {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  const createCategory = async () => {
    await db.run(`CREATE TABLE IF NOT EXISTS category (category_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    category_name TEXT NOT NULL);`);
  };

  const insertCategory = async (props) => {
    if (!props || !props.category_name) {
      throw new Error(`you must provide a category name`);
    }
    const { category_name } = props;
    try {
      const result = await db.run(
        SQL`INSERT INTO "main"."category"
                ("category_name")
                VALUES (${category_name});`
      );
    } catch (e) {
      throw new Error(`couldn't insert this combination: ` + e.message);
    }
  };
  const updatecategory = async (category_id, props) => {
    if (!props || !props.category_name) {
      throw new Error(`you must provide a firstname or an lastname or image or date or 
      adress or phone or email or quote or bio`);
    }
    const { category_name } = props;
    try {
      let statement = "";
      if (category_name) {
        statement = `update  category set category_name = '${category_name}' where category_id='${category_id}'`;
      }
      const result = await db.run(statement);
      if (result.stmt.changes === 0) {
        throw new Error(`no changes were made`);
      }
      return true;
    } catch (e) {
      throw new Error(
        `couldn't update the contact ${category_id}: ` + e.message
      );
    }
  };
  const deletecategory = async (category_id) => {
    try {
      const result = await db.run(
        `DELETE FROM category WHERE category_id=${category_id}`
      );
      if (result.stmt.changes === 0) {
        throw new Error(`contact "${category_id}" does not exist`);
      }
      return true;
    } catch (e) {
      throw new Error(
        `couldn't delete the contact "${category_id}": ` + e.message
      );
    }
  };
  const getallcategory = async () => {
    try {
      let statement = `SELECT * from category`;

      const rows = await db.all(statement);
      if (!rows.length) {
        throw new Error(`no rows found`);
      }
      return rows;
    } catch (e) {
      throw new Error(`couldn't retrieve about: ` + e.message);
    }
  };
  const getcategorybyid = async (category_id) => {
    try {
      let statement = `SELECT * from category where category_id = ${category_id}`;

      const rows = await db.all(statement);
      if (!rows.length) {
        throw new Error(`no rows found`);
      }
      return rows;
    } catch (e) {
      throw new Error(`couldn't retrieve about: ` + e.message);
    }
  };
  const controller = {
    createCategory,
    insertCategory,
    updatecategory,
    deletecategory,
    getallcategory,
    getcategorybyid,
  };

  return controller;
};

export default category;
