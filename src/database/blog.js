import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";
const init = async () => {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  const createBlog = async () => {
    await db.run(`CREATE TABLE IF NOT EXISTS blog (
      blog_id INTEGER PRIMARY KEY AUTOINCREMENT, 
      blog_title TEXT NOT NULL, 
      blog_content TEXT NOT NULL, 
      posting DATE NOT NULL,
      image TEXT,
      blog_status boolean, 
      user_id INTEGER,
      category_id INTEGER,
      FOREIGN KEY (category_id) references category(category_id),
      FOREIGN KEY (user_id) references user(user_id));`);
  };

  const insertblog = async (category_id, iduser, props) => {
    if (
      !props ||
      !props.blog_title ||
      !props.blog_content ||
      !props.posting ||
      !props.image ||
      !props.blog_status
    ) {
      throw new Error(`you must provide a name and an email`);
    }
    const { blog_title, blog_content, posting, image, blog_status } = props;
    try {
      const result = await db.run(
        SQL`INSERT INTO "main"."blog"
      ("blog_title", "blog_content", "posting", "image", "blog_status", "user_id", "category_id")
      VALUES (${blog_title}, ${blog_content}, ${posting}, ${image}, ${blog_status}, ${iduser},${category_id});`
        //
      );
      const id = result.stmt.lastID;
      return id;
    } catch (e) {
      throw new Error(`couldn't insert this combination: ` + e.message);
    }
  };
  const updateblog = async (category_id, blog_id, props) => {
    if (
      !props ||
      !props.blog_title ||
      !props.blog_content ||
      !props.posting ||
      !props.image ||
      !props.blog_status
    ) {
      throw new Error(`you must provide a firstname or an lastname or image or date or 
      adress or phone or email or quote or bio`);
    }
    const { blog_title, blog_content, posting, image, blog_status } = props;
    try {
      let statement = "";
      if (blog_title && blog_content && posting && image && blog_status) {
        statement = `update  blog set blog_title = '${blog_title}',
        blog_content= '${blog_content}',posting= '${posting}',
image='${image}',blog_status='${blog_status}',category_id='${category_id}' where blog_id = ${blog_id}`;
      }
      const result = await db.run(statement);
      if (result.stmt.changes === 0) {
        throw new Error(`no changes were made`);
      }
      return true;
    } catch (e) {
      throw new Error(`couldn't update the contact ${blog_id}: ` + e.message);
    }
  };
  const deleteblog = async (blog_id) => {
    try {
      const result = await db.run(`DELETE FROM blog WHERE blog_id=${blog_id}`);
      if (result.stmt.changes === 0) {
        throw new Error(`contact "${blog_id}" does not exist`);
      }
      return true;
    } catch (e) {
      throw new Error(`couldn't delete the contact "${blog_id}": ` + e.message);
    }
  };
  const getallblog = async () => {
    try {
      let statement = `SELECT * from blog`;

      const rows = await db.all(statement);
      if (!rows.length) {
        throw new Error(`no rows found`);
      }
      return rows;
    } catch (e) {
      throw new Error(`couldn't retrieve about: ` + e.message);
    }
  };
  const getblogbyid = async (blog_id) => {
    try {
      let statement = `SELECT * from blog where about_id = ${blog_id}`;

      const rows = await db.all(statement);
      if (!rows.length) {
        throw new Error(`no rows found`);
      }
      return rows;
    } catch (e) {
      throw new Error(`couldn't retrieve about: ` + e.message);
    }
  };
  //  const addBlog = async() =>{
  //      await stmt.finalize();
  //     const rows = await db.all("SELECT contact_id AS id, name, email FROM contacts");
  //      rows.forEach(({ id, name, email }) => console.log(`[id:${id}] - ${name} - ${email}`));
  //  }

  const controller = {
    createBlog,
    insertblog,
    updateblog,
    deleteblog,
    getallblog,
    getblogbyid,
  };

  return controller;
};

export default init;
