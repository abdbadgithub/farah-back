import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const testimonial = async () => {
    const db = await open({
        filename: "./db.sqlite",
        driver: sqlite3.Database,
    });

    const createTestimonial = async () => {
        await db.run(`CREATE TABLE IF NOT EXISTS testimonial (
            testimonial_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            testimonial_content TEXT NOT NULL, 
            name TEXT NOT NULL, 
            position TEXT NOT NULL , 
            image TEXT,
            company TEXT NOT NULL, 
            user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(user_id));`);
    }

    const insertTestimonial = async (id, props) => {
        if (!props || !props.testimonial_content || !props.name || !props.position 
            || !props.image || !props.company ) {
            throw new Error(`you must provide an account name and link`);
        }
        const { testimonial_content, name, position, image, company } = props;
        try {
            const result = await db.run(
                SQL`INSERT INTO "main"."testimonial"
                ("testimonial_content", "name", "position", "image", "company", "user_id")
                VALUES (${testimonial_content}, ${name}, ${position}, ${image}, ${company}, ${id});`
            );
        } catch (e) {
            throw new Error(`couldn't insert this combination: ` + e.message);
        }
    };

    const updateTestimonial = async (id, props) => {
        if (!props || !props.testimonial_content || !props.name || !props.position 
            || !props.image || !props.company ) {
            throw new Error(`you must provide testimonial infos`);
        }
        const { testimonial_content, name, position, image, company } = props;
        try {
            const res = await db.run(
                `UPDATE testimonial
              SET testimonial_content='${testimonial_content}', name='${name}', position='${position}',
              image='${image}', company='${company}'
              WHERE testimonial_id='${id}';`
            );
        } catch (e) {
            throw new Error(`couldn't update this testimonial: ` + e.message);
        }
    };

    const deleteTestimonial = async (id) => {
        try {
            const result = await db.run(`DELETE FROM testimonial WHERE testimonial_id=${id}`);
            if (result.stmt.changes === 0) {
                throw new Error(`testimonial "${id}" does not exist`);
            }
            return true;
        } catch (e) {
            throw new Error(`couldn't delete this testimonial "${id}": ` + e.message);
        }
    }

    const getTestimonial = async () => {
        try {
            const s = await db.all(
                SQL`SELECT * FROM testimonial`
            );
            if (!s) {
                throw new Error("testimonial not found");
            }
            return s;
        } catch (e) {
            throw new Error("Cannot get the testimonial" + e.message);
        }
    };

    
    const controller = {
        createTestimonial,
        insertTestimonial,
        updateTestimonial,
        deleteTestimonial,
        getTestimonial
    };

    return controller;
};

export default testimonial;