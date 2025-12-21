import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

// Create new user //
// const createUser = async (payload: Record<string, unknown>) => {
//   const { name, email, password, phone, role } = payload;
//   const hashedPassword = await bcrypt.hash(password as string, 10);

//   const result = await pool.query(`INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, email, hashedPassword, phone, role]);

//   return result;
// }

// Get All Users //
const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
}

// Get Single User //
const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
}

// Update user //
const updateUser = async (payload: Record<string, unknown>, userRole: string) => {
  const { name, email, phone, role, id } = payload;

  if (userRole === "admin") {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, email, phone, role, id]);
    return result;
  }

  if(userRole === "customer") {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *`, [name, email, phone, id]);
    return result;
  }

}

// Delete User //
const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
}


export const userServices = {
  // createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
}