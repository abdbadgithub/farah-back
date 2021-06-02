// back/src/index.js
import app from "./app";
import initializeDatabase from "./db";

import exp from "./database/experience";
import cat from "./database/category";
import userr from "./database/user";
import testim from "./database/testimonial";
import educ from "./database/education";
import ab from "./database/about";
import sm from "./database/socialmedia";
import bl from "./database/blog";
import cmt from "./database/comment";
import s from "./database/skill";

const start = async () => {
  const controller = await initializeDatabase();
  const experience = await exp();
  const category = await cat();
  const user = await userr();
  const testimonial = await testim();
  const education = await educ();
  const about = await ab();
  const socialmedia = await sm();
  const blog = await bl();
  const comment = await cmt();
  const skill = await s();

  app.get("/", (req, res) => res.send("ok"));
  app.get("/", (req, res, next) => res.send("ok"));

  app.get("/created", async (req, res) => {
    await user.createUser();
    await skill.createSkill();
    await experience.createExperience();
    await education.createEducation();
    await testimonial.createTestimonial();
    await about.createAbout();
    await socialmedia.createSocialmedia();
    await blog.createBlog();
    await comment.createComment();
    await category.createCategory();
    res.json({ success: true });
  });
  const path = require("path");
  const multer = require("multer");

  const multerStorage = multer.diskStorage({
    destination: path.join(__dirname, "../public/images"),
    filename: (req, file, cb) => {
      const { fieldname, originalname } = file;
      const date = Date.now();
      // filename will be: image-1345923023436343-filename.png
      const filename = `${fieldname}-${date}-${originalname}`;
      cb(null, filename);
    },
  });
  const upload = multer({ storage: multerStorage });

  app.post(
    "/uploadimagetodatabase/update",
    upload.single("file"),
    async function (req, res, next) {
      const image = req.file && req.file.filename;
      console.log(image);
    }
  );

  //! about table
  app.post("/about/add/:iduser", async (req, res, next) => {
    const { iduser } = req.params;
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
    } = req.body;
    await about.insertabout(iduser, {
      firstname,
      lastname,
      image,
      dob,
      address,
      phone,
      email,
      quote,
      bio,
    });
    res.json({ success: true, result });
  });
  app.post("/about/update/:idabout/", async (req, res, next) => {
    const { idabout } = req.params;
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
    } = req.body;
    const result = await about.updateabout(idabout, {
      firstname,
      lastname,
      image,
      dob,
      address,
      phone,
      email,
      quote,
      bio,
    });
    res.json({ success: true, result });
  });
  app.get("/about/delete/:idabout", async (req, res, next) => {
    let { idabout } = req.params;

    await about.deleteabout(idabout);
    res.json({ success: true });
  });
  app.get("/about/getall", async (req, res, next) => {
    let result = await about.getallabout();

    res.json({ success: true, result: result });
  });
  app.get("/about/getabout/:idabout", async (req, res, next) => {
    const { idabout } = req.params;
    const result = await about.getaboutbyid(idabout);
    res.json({ success: true, result: result });
  });
  //!blog table

  app.post("/blog/insert/:category_id/:iduser", async (req, res, next) => {
    const { category_id, iduser } = req.params;
    const { blog_title, blog_content, posting, image, blog_status } = req.body;
    const result = await blog.insertblog(category_id, iduser, {
      blog_title,
      blog_content,
      posting,
      image,
      blog_status,
    });
    res.json({ success: true });
  });

  app.post("/blog/update/:category_id/:blog_id", async (req, res, next) => {
    const { category_id, blog_id } = req.params;
    const { blog_title, blog_content, posting, image, blog_status } = req.body;
    const result = await blog.updateblog(category_id, blog_id, {
      blog_title,
      blog_content,
      posting,
      image,
      blog_status,
    });
    res.json({ success: true });
  });
  app.get("/blog/delete/:idblog", async (req, res, next) => {
    let { idblog } = req.params;

    await blog.deleteblog(idblog);
    res.json({ success: true });
  });
  app.get("/blog/getall", async (req, res, next) => {
    let result = await blog.getallblog();

    res.json({ success: true, result: result });
  });
  app.get("/blog/getblog/:idblog", async (req, res, next) => {
    const { idblog } = req.params;
    const result = await blog.getblogbyid(idblog);
    res.json({ success: true, result: result });
  });

  //! users methods
  app.post("/user/add", async (req, res, next) => {
    const { name, password } = req.body;
    await user.insertUser({ name, password });
    res.json({ success: true });
  });

  app.post("/user/update/:iduser", async (req, res, next) => {
    let { iduser } = req.params;
    const { username, password } = req.body;
    await user.updateUser(iduser, { username, password });
    res.json({ sucess: true });
  });

  app.get("/user/getusers/:id", async (req, res, next) => {
    const { id } = req.params;
    const u = await user.getUserById(id);
    res.json({ success: true, result: u });
  });

  app.get("/user/getuser", async (req, res, next) => {
    const usr = await user.getUser();
    res.json({ success: true, result: usr });
  });

  app.get("/user/delete/:id", async (req, res, next) => {
    let { id } = req.params;
    await user.deleteUser(id);
    res.json({ success: true });
  });

  //!skill methods
  app.post(
    "/skill/add/:iduser",
    upload.single("file"),
    async (req, res, next) => {
      const { iduser } = req.params;
      const skillname = req.body.skillname;
      const skill_icon = req.file && req.file.filename;
      //console.log(skill_icon);
      const result = await skill.insertSkill(iduser, { skillname, skill_icon });
      res.json({ success: true, result });
    }
  );

  app.post(
    "/skill/update/:idskill",
    upload.single("file"),
    async (req, res, next) => {
      const { idskill } = req.params;
      const skillname = req.body.skillname;
      const skill_icon = req.file && req.file.filename;
      await skill.updateSkill(idskill, { skillname, skill_icon });
      res.json({ sucess: true });
    }
  );

  app.post("/skill/delete/:id", async (req, res, next) => {
    let { id } = req.params;
    await skill.deleteSkill(id);
    res.json({ success: true });
  });

  app.get("/skill/getskill/:id", async (req, res, next) => {
    const { id } = req.params;
    const u = await skill.getSkillById(id);
    res.json({ success: true, result: u });
  });

  app.get("/skill/getskills", async (req, res, next) => {
    const uu = await skill.getSkill();
    res.json({ success: true, result: uu });
  });

  //!education methods
  app.post("/education/add", async (req, res, next) => {
    const { degree, major, graduation_date } = req.body;
    const result = await education.insertEducation({
      degree,
      major,
      graduation_date,
    });
    res.json({ success: true, result });
  });

  app.post("/education/update/:id", async (req, res, next) => {
    let { id } = req.params;
    const { degree, major, graduation_date } = req.body;
    await education.updateEducation(id, { degree, major, graduation_date });
    res.json({ sucess: true });
  });

  app.get("/education/delete/:id", async (req, res, next) => {
    let { id } = req.params;
    await education.deleteEducation(id);
    res.json({ success: true });
  });

  app.get("/education/geteducation", async (req, res, next) => {
    const uu = await education.getEducation();
    res.json({ success: true, result: uu });
  });

  //!Social media methods
  app.post("/socialmedia/add/:aboutid", async (req, res, next) => {
    let { aboutid } = req.params;
    const { account_name, account_link } = req.body;
    const result = await socialmedia.insertSocialmedia(aboutid, {
      account_name,
      account_link,
    });

    res.json({ success: true, result });
  });

  app.post("/socialmedia/update/:id", async (req, res, next) => {
    let { id } = req.params;
    const { account_name, account_link } = req.body;
    await socialmedia.updateSocialmedia(id, { account_name, account_link });
    res.json({ sucess: true });
  });

  app.get("/socialmedia/delete/:id", async (req, res, next) => {
    let { id } = req.params;
    await socialmedia.deleteSocialmedia(id);
    res.json({ success: true });
  });

  app.get("/socialmedia/getsocialmedia", async (req, res, next) => {
    const uu = await socialmedia.getSocialmedia();
    res.json({ success: true, result: uu });
  });

  //!Testimonial methods
  app.post("/testimonial/add/:userid", async (req, res, next) => {
    let { userid } = req.params;
    const { testimonial_content, name, position, image, company } = req.body;
    const result = await testimonial.insertTestimonial(userid, {
      testimonial_content,
      name,
      position,
      image,
      company,
    });
    res.json({ success: true, result });
  });

  app.post("/testimonial/update/:id", async (req, res, next) => {
    let { id } = req.params;
    const { testimonial_content, name, position, image, company } = req.body;
    await testimonial.updateTestimonial(id, {
      testimonial_content,
      name,
      position,
      image,
      company,
    });
    res.json({ sucess: true });
  });

  app.get("/testimonial/delete/:id", async (req, res, next) => {
    let { id } = req.params;
    await testimonial.deleteTestimonial(id);
    res.json({ success: true });
  });

  app.get("/testimonial/gettestimonial", async (req, res, next) => {
    const uu = await testimonial.getTestimonial();
    res.json({ success: true, result: uu });
  });

  //!Experience methods
  app.post("/experience/add/:userid", async (req, res, next) => {
    let { userid } = req.params;
    const {
      job_title,
      company_name,
      location,
      employment_type,
      date_start,
      date_end,
      description,
      reference_name,
      reference_position,
      reference_phone,
      reference_email,
    } = req.body;
    const result = await experience.insertExperience(userid, {
      job_title,
      company_name,
      location,
      employment_type,
      date_start,
      date_end,
      description,
      reference_name,
      reference_position,
      reference_phone,
      reference_email,
    });
    res.json({ success: true, result });
  });

  app.post("/experience/update/:id", async (req, res, next) => {
    let { id } = req.params;
    const {
      job_title,
      company_name,
      location,
      employment_type,
      date_start,
      date_end,
      description,
      reference_name,
      reference_position,
      reference_phone,
      reference_email,
    } = req.body;
    await experience.updateExperience(id, {
      job_title,
      company_name,
      location,
      employment_type,
      date_start,
      date_end,
      description,
      reference_name,
      reference_position,
      reference_phone,
      reference_email,
    });
    res.json({ sucess: true });
  });

  app.get("/experience/delete/:id", async (req, res, next) => {
    let { id } = req.params;
    await experience.deleteExperience(id);
    res.json({ success: true });
  });

  app.get("/experience/getexperience", async (req, res, next) => {
    const uu = await experience.getExperience();
    res.json({ success: true, result: uu });
  });
  //! category
  app.post("/category/add", async (req, res, next) => {
    const { category_name } = req.body;
    await category.insertCategory({ category_name });
    res.json({ success: true });
  });

  app.post("/category/update/:idcategory", async (req, res, next) => {
    let { idcategory } = req.params;
    const { category_name } = req.body;
    await category.updatecategory(idcategory, { category_name });
    res.json({ sucess: true });
  });

  app.get("/category/getcategory/:idcategory", async (req, res, next) => {
    const { idcategory } = req.params;
    const u = await category.getcategorybyid(idcategory);
    res.json({ success: true, result: u });
  });

  app.get("/category/getcategory", async (req, res, next) => {
    const usr = await category.getallcategory();
    res.json({ success: true, result: usr });
  });

  app.get("/category/delete/:idcategory", async (req, res, next) => {
    let { idcategory } = req.params;
    await category.deletecategory(idcategory);
    res.json({ success: true });
  });

  //! comment
  app.post("/comment/add/:idblog", async (req, res, next) => {
    let { idblog } = req.params;
    const { comment_content, rating, comment_status } = req.body;
    await comment.insertComment(idblog, {
      comment_content,
      rating,
      comment_status,
    });
    res.json({ success: true });
  });

  app.post("/comment/update/:idcomment", async (req, res, next) => {
    let { idcomment } = req.params;
    const { comment_content, rating, comment_status } = req.body;
    await comment.updateComment(idcomment, {
      comment_content,
      rating,
      comment_status,
    });
    res.json({ sucess: true });
  });

  app.get("/comment/getcomment/:idcomment", async (req, res, next) => {
    const { idcomment } = req.params;
    const u = await comment.getCommentbyid(idcomment);
    res.json({ success: true, result: u });
  });

  app.get("/comment/getcomment", async (req, res, next) => {
    const usr = await comment.getallComment();
    res.json({ success: true, result: usr });
  });

  app.get("/comment/delete/:idcomment", async (req, res, next) => {
    let { idcomment } = req.params;
    await comment.deleteComment(idcomment);
    res.json({ success: true });
  });
  app.use((err, req, res, next) => {
    try {
      console.error(err);
      const message = err.message;
      res.status(500).json({ success: false, message });
      // do something
    } catch (e) {
      next(e);
    }
  });

  app.listen(8080, () => console.log("server listening on port 8080"));
};
start();
