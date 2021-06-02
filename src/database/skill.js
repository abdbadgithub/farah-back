import { open } from "sqlite";
import sqlite3 from "sqlite3";
import SQL from "sql-template-strings";

const skill = async () => {
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  const createSkill = async () => {
    await db.run(`CREATE TABLE IF NOT EXISTS skill (
         skill_id integer PRIMARY KEY AUTOINCREMENT,
         skill_name TEXT NOT NULL,
         skill_icon TEXT NOT NULL,
         user_id integer,
      FOREIGN KEY (user_id) REFERENCES user(user_id));`);
  };

  //insert skill
  const insertSkill = async (iduser, props) => {
    if (!props || !props.skillname || !props.skill_icon) {
      throw new Error(`you must provide the name, the skill_icon`);
    }
    const { skillname, skill_icon } = props;
    try {
      const result = await db.run(
        SQL`INSERT INTO "main"."skill"
          ("skill_name", "skill_icon","user_id")
          VALUES (${skillname}, ${skill_icon}, ${iduser});`
      );
    } catch (e) {
      throw new Error(`couldn't insert this combination: ` + e.message);
    }
  };

  const updateSkill = async (idskill, props) => {
    if (!props || !props.skillname || !props.skill_icon) {
      throw new Error(`you must provide a skill name and its skill_icon`);
    }
    const { skillname, skill_icon } = props;
    try {
      const res = await db.run(
        `UPDATE skill
            SET skill_name='${skillname}', skill_icon='${skill_icon}'
            WHERE skill_id=${idskill};`
      );
    } catch (e) {
      throw new Error(`couldn't update this skill: ` + e.message);
    }
  };

  const deleteSkill = async (id) => {
    try {
      const result = await db.run(`DELETE FROM skill WHERE skill_id=${id}`);
      if (result.stmt.changes === 0) {
        throw new Error(`skill "${id}" does not exist`);
      }
      return true;
    } catch (e) {
      throw new Error(`couldn't delete the skill "${id}": ` + e.message);
    }
  };

  const getSkillById = async (id) => {
    try {
      const skillslist = await db.all(
        SQL`SELECT skill_id AS id, skill_name, skill_icon FROM skill WHERE skill_id = ${id}`
      );
      const sk = skillslist[0];
      if (!sk) {
        throw new Error(`skill ${id} not found`);
      }
      return sk;
    } catch (e) {
      throw new Error(`couldn't get the skill ${id}: ` + e.message);
    }
  };

  const getSkill = async () => {
    try {
      const s = await db.all(SQL`SELECT * FROM skill`);
      if (!s) {
        throw new Error("Skill not found");
      }
      return s;
    } catch (e) {
      throw new Error("Cannot get the Skill" + e.message);
    }
  };

  const controller = {
    createSkill,
    insertSkill,
    updateSkill,
    deleteSkill,
    getSkillById,
    getSkill,
  };

  return controller;
};

export default skill;
