const Sequelize = require("sequelize");
const { STRING, TEXT } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/wnews_sequelize"
);

const User = conn.define("User", {
  name: {
    type: STRING,
  },
});

const Post = conn.define("Post", {
  title: {
    type: STRING,
  },
  content: {
    type: TEXT,
  },
});

Post.belongsTo(User);

const setup = async () => {
  try {
    //Connect to the DB
    await conn.sync({ force: true });
    const prof = await User.create({ name: "Prof" });
    const colton = await User.create({ name: "Colton" });
    await User.create({ name: "Jonathan" });
    await User.create({ name: "Shannon" });
    await Post.create({title: 'One Two', content:'Buckle the shoe', userId: prof.id});
    await Post.create({title: 'Three Four', content:'Shut the shoe', userId: prof.id});
    await Post.create({title: 'Five Six', content:'Pick up the shoe', userId: colton.id});
  } catch (error) {
    console.log(error);
  }
};

setup();
