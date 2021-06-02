import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const comment = async () => {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  const createComment = async () => {
    await db.run(`CREATE TABLE IF NOT EXISTS comment (
            comment_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            comment_content TEXT NOT NULL, 
            rating INTEGER, 
            comment_status boolean, 
            blog_id INTEGER,
    FOREIGN KEY (blog_id) REFERENCES blog(blog_id));`);
  };

  const insertComment = async (blog_id, props) => {
    if (
      !props ||
      !props.comment_content ||
      !props.rating ||
      !props.comment_status
    ) {
      throw new Error(`you must provide a name and an password`);
    }
    const { comment_content, rating, comment_status } = props;
    try {
      const result = await db.run(
        SQL`INSERT INTO "main"."comment"
("comment_content", "rating", "comment_status", "blog_id")
VALUES (${comment_content}, ${rating}, ${comment_status}, ${blog_id});`
      );
    } catch (e) {
      throw new Error(`couldn't insert this combination: ` + e.message);
    }
  };
  const getallComment = async () => {
    try {
      let statement = `SELECT * from comment`;

      const rows = await db.all(statement);
      if (!rows.length) {
        throw new Error(`no rows found`);
      }
      return rows;
    } catch (e) {
      throw new Error(`couldn't retrieve about: ` + e.message);
    }
  };
  const getCommentbyid = async (comment_id) => {
    try {
      let statement = `SELECT * from comment where comment_id = ${comment_id}`;

      const rows = await db.all(statement);
      if (!rows.length) {
        throw new Error(`no rows found`);
      }
      return rows;
    } catch (e) {
      throw new Error(`couldn't retrieve about: ` + e.message);
    }
  };
  const updateComment = async (comment_id, props) => {
    if (
      !props ||
      !props.comment_content ||
      !props.rating ||
      !props.comment_status
    ) {
      throw new Error(`you must provide a name and an password`);
    }
    const { comment_content, rating, comment_status } = props;
    try {
      let statement = "";
      if (comment_content && rating && comment_status) {
        statement = `update  comment set comment_content = '${comment_content}',
        rating= '${rating}',comment_status= '${comment_status}' where comment_id = ${comment_id}`;
      }
      const result = await db.run(statement);
      if (result.stmt.changes === 0) {
        throw new Error(`no changes were made`);
      }
      return true;
    } catch (e) {
      throw new Error(
        `couldn't update the contact ${comment_id}: ` + e.message
      );
    }
  };
  const deleteComment = async (comment_id) => {
    try {
      const result = await db.run(
        `DELETE FROM comment WHERE comment_id=${comment_id}`
      );
      if (result.stmt.changes === 0) {
        throw new Error(`contact "${idabout}" does not exist`);
      }
      return true;
    } catch (e) {
      throw new Error(`couldn't delete the contact "${idabout}": ` + e.message);
    }
  };
  const controller = {
    createComment,
    getCommentbyid,
    getallComment,
    insertComment,
    updateComment,
    deleteComment,
  };

  return controller;
};

export default comment;
