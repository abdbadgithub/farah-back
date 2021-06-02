import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const about = async () => {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  //create the table
  const createAbout = async () => {
    await db.run(`CREATE TABLE IF NOT EXISTS about (
            about_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            image TEXT,
            date_of_birth DATE,
            address TEXT,
            phone INTEGER,
            email TEXT NOT NULL,
            favorite_quote TEXT,
            bio TEXT,
            user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(user_id));`);
  };

  //insert data inside the table(data passed in the url)
  const insertabout = async (iduser, props) => {
    if (
      !props ||
      !props.firstname ||
      !props.lastname ||
      !props.image ||
      !props.dob ||
      !props.address ||
      !props.phone ||
      !props.email ||
      !props.quote ||
      !props.bio
    ) {
      throw new Error(`you must provide a name and an password`);
    }
    const {
      firstname,
      lastname,
      image,
      dob,
      address,
      phone,
      email,
      quote,
      bio,
    } = props;
    try {
      const result = await db.run(
        SQL`INSERT INTO "main"."about"
            ("first_name", "last_name", "image", "date_of_birth", "address",
             "phone", "email", "favorite_quote", "bio", "user_id")
            VALUES (${firstname}, ${lastname}, ${image}, ${dob}, ${address},
             ${phone}, ${email}, ${quote}, ${bio}, ${iduser});`
      );
    } catch (e) {
      throw new Error(`couldn't insert this combination: ` + e.message);
    }
  };
  const getallabout = async () => {
    try {
      let statement = `SELECT * from about`;

      const rows = await db.all(statement);
      if (!rows.length) {
        throw new Error(`no rows found`);
      }
      return rows;
    } catch (e) {
      throw new Error(`couldn't retrieve about: ` + e.message);
    }
  };
  const getaboutbyid = async (about_id) => {
    try {
      let statement = `SELECT * from about where about_id = ${about_id}`;

      const rows = await db.all(statement);
      if (!rows.length) {
        throw new Error(`no rows found`);
      }
      return rows;
    } catch (e) {
      throw new Error(`couldn't retrieve about: ` + e.message);
    }
  };
  const updateabout = async (idabout, props) => {
    if (
      !props ||
      !props.firstname ||
      !props.lastname ||
      !props.image ||
      !props.dob ||
      !props.address ||
      !props.phone ||
      !props.email ||
      !props.quote ||
      !props.bio
    ) {
      throw new Error(`you must provide a firstname or an lastname or image or date or 
      adress or phone or email or quote or bio`);
    }
    const {
      firstname,
      lastname,
      image,
      dob,
      address,
      phone,
      email,
      quote,
      bio,
    } = props;
    try {
      let statement = "";
      if (
        firstname &&
        lastname &&
        image &&
        dob &&
        address &&
        phone &&
        quote &&
        bio
      ) {
        statement = `UPDATE about SET first_name = '${firstname}',
        last_name= '${lastname}',image= '${image}',
date_of_birth='${dob}',address='${address}',phone='${phone}',email='${email}',
favorite_quote='${quote}',bio='${bio}' where about_id = ${idabout}`;
      }
      const result = await db.run(statement);
      if (result.stmt.changes === 0) {
        throw new Error(`no changes were made`);
      }
      return true;
    } catch (e) {
      throw new Error(`couldn't update the contact ${idabout}: ` + e.message);
    }
  };
  const deleteabout = async (idabout) => {
    try {
      const result = await db.run(
        `DELETE FROM about WHERE about_id=${idabout}`
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
    createAbout,
    insertabout,
    updateabout,
    deleteabout,
    getallabout,
    getaboutbyid,
  };

  return controller;
};

export default about;
