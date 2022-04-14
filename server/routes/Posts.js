const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });    //Função para pegar as informações do usuario com base no id.
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/byId/:id", async (req, res) => {  
  const id = req.params.id;
  const post = await Posts.findByPk(id);     //Função para pegar as informações do usuario com base no id.
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {    //Requisição dos posts do usuário.
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({    //Função para pegar todos os posts do usuario.
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;     //Requesição do id.
  await Posts.create(post);
  res.json(post);
});

router.put("/title", validateToken, async (req, res) => {    //Atualização do titulo.
  const {newTitle, id} = req.body;
  await Posts.update({title: newTitle}, {where: {id: id}})
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {    //Atualização do Posts.
  const {newText, id} = req.body;
  await Posts.update({title: newText}, {where: {id: id}})
  res.json(newText);
});

router.delete("/:postId", validateToken, async (req, res) => {    //Rota de solicitação de delete do post.
  const postId = req.params.postId;
  await Posts.destroy({           //Função de destruir o postId.
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;