const Sequelize = require("sequelize");
const { STRING, TEXT } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/wnews_sequelize"
);

//define will create the tables
const User = conn.define("user", {
  name: {
    type: STRING,
  },
});

const Post = conn.define("post", {
  title: {
    type: STRING,
  },
  content: {
    type: TEXT,
  }
});

// Post.belongsTo(User);
User.hasMany(Post)

module.exports = {
  conn,
  User,
  Post
}
