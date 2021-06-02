import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const socialmedia = async () => {
    const db = await open({
        filename: "./db.sqlite",
        driver: sqlite3.Database,
    });

    const createSocialmedia = async () => {
        await db.run(`CREATE TABLE IF NOT EXISTS socialmedia (
            socialmedia_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            account_name TEXT NOT NULL, 
            account_link TEXT,
            about_id INTEGER,
    FOREIGN KEY (about_id) REFERENCES about(about_id));`);
    }

    const insertSocialmedia = async (id, props) => {
        if (!props || !props.account_name || !props.account_link) {
            throw new Error(`you must provide an account name and link`);
        }
        const { account_name, account_link } = props;
        try {
            const result = await db.run(
                SQL`INSERT INTO "main"."socialmedia"
                ("account_name", "account_link", "about_id")
                VALUES (${account_name}, ${account_link}, ${id});`
            );
        } catch (e) {
            throw new Error(`couldn't insert this combination: ` + e.message);
        }
    };

    const updateSocialmedia = async (id, props) => {
        if (!props || !props.account_name || !props.account_link) {
            throw new Error(`you must provide an account name and link`);
        }
        const { account_name, account_link } = props;
        try {
            const res = await db.run(
                `UPDATE socialmedia
              SET account_name='${account_name}', account_link='${account_link}'
              WHERE socialmedia_id='${id}';`
            );
        } catch (e) {
            throw new Error(`couldn't update this social media account: ` + e.message);
        }
    };

    const deleteSocialmedia = async (id) => {
        try {
            const result = await db.run(`DELETE FROM socialmedia WHERE socialmedia_id=${id}`);
            if (result.stmt.changes === 0) {
                throw new Error(`social media account "${id}" does not exist`);
            }
            return true;
        } catch (e) {
            throw new Error(`couldn't delete this social media account "${id}": ` + e.message);
        }
    }

    const getSocialmedia = async () => {
        try {
            const s = await db.all(
                SQL`SELECT * FROM socialmedia`
            );
            if (!s) {
                throw new Error("social media accounts not found");
            }
            return s;
        } catch (e) {
            throw new Error("Cannot get the social media accounts" + e.message);
        }
    };

    const controller = {
        createSocialmedia,
        insertSocialmedia,
        updateSocialmedia,
        deleteSocialmedia,
        getSocialmedia
    };

    return controller;
};

export default socialmedia;