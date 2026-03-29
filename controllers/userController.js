import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res) {
  const hashPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    fristName: req.body.fristName,
    lastName: req.body.lastName,
    password: hashPassword,
  });

  user
    .save()
    .then(() => {
      res.status(201).json({ message: "user create successfully" });
    })
    .catch(() => {
      res.status(500).json({ message: "failed to create user" });
    });
}

export function loginUser(req, res) {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user == null) {
      res.status(404).json({
        message: "user not found.",
      });
    } else {
      const isPasswordMatching = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (isPasswordMatching) {
        const token = jwt.sign(
          {
            email: user.email,
            fristName: user.fristName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          },
          process.env.JWT_SECRET
        );

        res.status(200).json({
          message: "login successfull",
          token: token,
          user: {
            email: user.email,
            fristName: user.fristName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          },
        });
      } else {
        res.status(401).json({
          message: "invalid password..",
        });
      }
    }
  });
}

export function isAdmin(req) {
  if (req.user == null) {
    return false;
  }

  if (req.user.role != "admin") {
    return false;
  }

  return true;
}

export function getUser(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "you are not authorized",
    });
  } else {
    res.status(200).json({
      user: req.user,
    });
  }
}

export async function getAllUsers(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "access denied",
      });
    }

    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "failed to get users",
    });
  }
}

export async function updateUserRole(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "access denied",
      });
    }

    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        message: "email and role are required",
      });
    }

    if (role !== "admin" && role !== "user") {
      return res.status(400).json({
        message: "invalid role",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { role: role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      message: "user role updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "failed to update user role",
    });
  }
}