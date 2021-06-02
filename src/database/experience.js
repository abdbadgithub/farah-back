import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const experience = async () => {
    const db = await open({
        filename: "./db.sqlite",
        driver: sqlite3.Database,
    });

    const createExperience = async () => {
        await db.run(`CREATE TABLE IF NOT EXISTS experience (
            experience_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            job_title TEXT NOT NULL, 
            company_name TEXT NOT NULL, 
            location TEXT NOT NULL, 
            employment_type TEXT NOT NULL,
            date_start DATE NOT NULL, 
            date_end DATE NOT NULL, 
            description TEXT, 
            reference_name TEXT NOT NULL,
            reference_position TEXT NOT NULL,
            reference_phone INTEGER,
            reference_email TEXT NOT NULL,
            user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(user_id));`);
    }

    const insertExperience = async (user_id, props) => {
        if (!props || !props.job_title || !props.company_name || !props.location || !props.employment_type 
            || !props.date_start || !props.date_end || !props.description || !props.reference_name 
            || !props.reference_position || !props.reference_phone || !props.reference_email) {
            throw new Error(`you must provide all the required infos`);
        }
        const { job_title, company_name, location, employment_type, date_start, date_end, description, 
            reference_name, reference_position, reference_phone, reference_email } = props;
        try {
            const result = await db.run(
                SQL`INSERT INTO "main"."experience"
                ("job_title", "company_name", "location", "employment_type", "date_start", "date_end", "description", 
                "reference_name", "reference_position", "reference_phone", "reference_email", "user_id")
                VALUES (${job_title}, ${company_name}, ${location}, ${employment_type}, ${date_start}, 
                    ${date_end}, ${description}, ${reference_name}, ${reference_position}, 
                    ${reference_phone},${reference_email}, ${user_id});`
            );
        } catch (e) {
            throw new Error(`couldn't insert this combination: ` + e.message);
        }
    };

    const updateExperience = async (id, props) => {
        if (!props || !props.job_title || !props.company_name || !props.location || !props.employment_type 
            || !props.date_start || !props.date_end || !props.description || !props.reference_name 
            || !props.reference_position || !props.reference_phone || !props.reference_email) {
            throw new Error(`you must provide all the required infos`);
        }
        const { job_title, company_name, location, employment_type, date_start, date_end, description, 
            reference_name, reference_position, reference_phone, reference_email } = props;
        try {
            const res = await db.run(
                `UPDATE experience
              SET job_title='${job_title}', company_name='${company_name}', location='${location}', employment_type='${employment_type}',
              date_start='${date_start}', date_end='${date_end}',description='${description}',reference_name='${reference_name}',
              reference_position='${reference_position}', reference_phone='${reference_phone}',reference_email='${reference_email}'
              WHERE experience_id='${id}';`
            );
        } catch (e) {
            throw new Error(`couldn't update this experience ` + e.message);
        }
    };

    const deleteExperience = async (id) => {
        try {
            const result = await db.run(`DELETE FROM experience WHERE experience_id=${id}`);
            if (result.stmt.changes === 0) {
                throw new Error(`experience "${id}" does not exist`);
            }
            return true;
        } catch (e) {
            throw new Error(`couldn't delete this experience "${id}": ` + e.message);
        }
    }

    const getExperience = async () => {
        try {
            const s = await db.all(
                SQL`SELECT * FROM experience`
            );
            if (!s) {
                throw new Error("experience not found");
            }
            return s;
        } catch (e) {
            throw new Error("Cannot get the experience" + e.message);
        }
    };

    
    const controller = {
        createExperience,
        insertExperience,
        updateExperience,
        deleteExperience,
        getExperience
    };

    return controller;
};

export default experience;