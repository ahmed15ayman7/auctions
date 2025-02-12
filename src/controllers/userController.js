const prisma = require("../prismaClient");
const { userSchema } = require("../utils/validators");

 const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

 const createUser = async (req, res, next) => {
  try {
    const data = userSchema.parse(req.body);
    const user = await prisma.user.create({ data });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, createUser };