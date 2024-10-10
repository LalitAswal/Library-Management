import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../database/userdb.js";

export const userRegistrationService = async (userName, password) => {
  const existingUser = await User.findOne({ where: { username: userName } });
  console.log("existingUser", existingUser);
  if (existingUser) {
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username: userName,
    password: hashedPassword,
  });
  console.log(" newUser", newUser);
  return newUser?.id;
};

export const loginUserService = async (userName, password) => {
  const user = await User.findOne({ where: { username: userName } });
  if (!user) {
    console.error("Incorrect username");
    throw new Error(`Incorrect username and password`);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.error("Incorrect password");
    throw new Error(`Incorrect username and password`);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};

export const deleteUserService = async (id) => {
  const result = await User.update(
    { isDeleted: true },
    {
      where: {
        id,
        role:"member",
      },
      returning: true,
    }
    
  );
  if (!result || result[1].length === 0) {
    throw new Error(`no member found with ${id}`);
  }
  return result;
};

export const getAllUsersService = async () =>{
  const result = await User.findAll({}, {
    where:{
      role: 'member',
    }
  });
  console.log('checking result', result);
  if(result.length<1){
    throw new Error(`no member list found `)
  }
  return result;
}


// const userUpdateService = async(id) => {

// };