import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const education = async () => {
    const db = await open({
        filename: "./db.sqlite",
        driver: sqlite3.Database,
    });

    const createEducation = async () => {
        await db.run(`CREATE TABLE IF NOT EXISTS education (
            education_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            degree TEXT NOT NULL, 
            major TEXT NOT NULL, 
            graduation_date DATE, 
            user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(user_id));`);
    }

    const insertEducation = async (props) => {
        if (!props || !props.degree || !props.major || !props.graduation_date || !props.user_id) {
            throw new Error(`you must provide a degree, major, user id and the graduation date`);
        }
        const { degree, major, graduation_date, user_id } = props;
        try {
            const result = await db.run(
                SQL`INSERT INTO "main"."education"
                ("degree", "major", "graduation_date", "user_id")
                VALUES (${degree}, ${major}, ${graduation_date}, ${user_id});`
            );
        } catch (e) {
            throw new Error(`couldn't insert this combination: ` + e.message);
        }
    };

    const updateEducation = async (id, props) => {
        if (!props || !props.degree || !props.major || !props.graduation_date) {
            throw new Error(`you must provide a degree, major and the graduation date`);
        }
        const { degree, major, graduation_date } = props;
        try {
            const res = await db.run(
                `UPDATE education
              SET degree='${degree}', major='${major}', graduation_date='${graduation_date}'
              WHERE education_id='${id}';`
            );
        } catch (e) {
            throw new Error(`couldn't update this education: ` + e.message);
        }
    };

    const deleteEducation = async (id) => {
        try {
            const result = await db.run(`DELETE FROM education WHERE education_id=${id}`);
            if (result.stmt.changes === 0) {
                throw new Error(`education "${id}" does not exist`);
            }
            return true;
        } catch (e) {
            throw new Error(`couldn't delete this education "${id}": ` + e.message);
        }
    }

    const getEducation = async () => {
        try {
            const s = await db.all(
                SQL`SELECT * FROM education`
            );
            if (!s) {
                throw new Error("education not found");
            }
            return s;
        } catch (e) {
            throw new Error("Cannot get the education" + e.message);
        }
    };

    const controller = {
        createEducation,
        insertEducation,
        updateEducation,
        deleteEducation,
        getEducation
    };

    return controller;
};

export default education;