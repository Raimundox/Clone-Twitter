const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {        //Solicitação de postagem para criar um usuario.
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {       //Solicitação de login.
  const { username, password } = req.body;

  Users.findOne({ where: { username: username } }).then((user) => {
    if (!user) {
      res.json({ error: "Username Doesn't Exist" });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        const accessToken = sign(
          { username: user.username, id: user.id },
          "importantsecret"
        );
        res.json(accessToken);
      } else {
        res.json({ error: "Wrong Username And Password Combination" });
      }
    }
  });
    });
  ;

router.get("/auth", validateToken, (req, res) => {     //Solicitaçãao de autentificação.
  res.json(req.user);
});

router.get("/basicinfo/:id",async (req, res) => {      //Solicitação de visualização do perfil do usuario.
  const id = req.params.id;      //requissão do id.

  const basicInfo = await Users.findByPk(id, {    //Função para pegar as informações do usuario com base no id.
    atributes: {exclude: ["password"]},         //Atributos que não queremos que retorne.
  })
  res.json(basicInfo);
})

router.put("/changepassword", validateToken, async (req, res) => {    //Rota para alterar a senha. 
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
});
module.exports = router;