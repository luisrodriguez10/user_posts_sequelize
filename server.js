const db = require("./db");
const { conn, User, Post } = db;
const express = require("express");
const app = express();

app.use(express.static("assets"));

app.get("/", (req, res) => {
  res.redirect("/users");
});

app.get("/users", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(`
            <html>
                <head>
                    <title> Wizard News</title>
                    <link rel='stylesheet' href='/styles.css'>
                </head>
                <body>
                    <h1>Wizards News Sequelize</h1>
                    <ul>
                        ${users
                          .map(
                            (user) => `
                           <li><a href='/users/${user.id}/posts'> ${user.name}</a></li>
                        `
                          )
                          .join("")}
                    </ul>
                </body>
            </html>
        `);
  } catch (error) {
    next(error);
  }
});

app.get("/users/:id/posts", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    const posts = await Post.findAll({
      where: {
        userId: req.params.id,
      },
    });
    res.send(`
            <html>
                <head>
                    <title> Wizard News</title>
                    <link rel='stylesheet' href='/styles.css'>
                </head>
                <body>
                    <h1>Wizards News Sequelize</h1>
                    <a href='/users'>All Users</a>
                    <h2>Posts for ${user.name}</h2>
                    <ul>
                        ${posts
                          .map(
                            (post) => `
                            <li>
                                ${post.title}
                                <p>
                                    ${post.content}
                                </p>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                    ${posts.length === 0 ? 'No posts yet' : ''}
                </body>
            </html>
        `);
  } catch (error) {
    next(error);
  }
});

const setup = async () => {
  try {
    //Connect to the DB, create and insert into tables
    await conn.sync({ force: true });
    const prof = await User.create({ name: "Prof" });
    const colton = await User.create({ name: "Colton" });
    await User.create({ name: "Jonathan" });
    await User.create({ name: "Shannon" });
    await Post.create({
      title: "One Two",
      content: "Buckle the shoe",
      userId: prof.id,
    });
    await Post.create({
      title: "Three Four",
      content: "Shut the shoe",
      userId: prof.id,
    });
    await Post.create({
      title: "Five Six",
      content: "Pick up the shoe",
      userId: colton.id,
    });
    await Post.create({
      title: "Seven Eight",
      content: "Something else",
      userId: colton.id,
    });
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send(err)
})

setup();
