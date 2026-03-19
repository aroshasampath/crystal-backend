import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export function createUser(req,res){
 
    const hashPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User(
        {
            email    :req.body.email,
            fristName:req.body.fristName,
            lastName :req.body.lastName,
            password :hashPassword
        }
    )

    user.save().then(
        ()=>{
           res.status(201).json({ message : "user create successfully"})
        }
    ).catch(
        ()=>{
            res.status(500).json({message :"failed to create user"})
        }
    )
}


export function loginUser(req,res){
    User.findOne(
        {
            email : req.body.email
        }
    ).then(
        (user)=>{
            if(user == null){
                res.status(404).json({
                    message :"user not found."
                })
            }else{
                const isPasswordMatching = bcrypt.compareSync(req.body.password , user.password)
                if(isPasswordMatching){
                    
                    const token = jwt.sign(
                        {
                            email           : user.email,
                            fristName       :user.fristName,
                            lastName        :user.lastName,
                            role            :user.role,
                            isEmailVerified :user.isEmailVerified

                        },
                        process.env.JWT_SECRET

                    )

                    res.status(200).json(
                        {
                            message : "login successfull",
                            token:token,
                            user :{
                                email           : user.email,
                                fristName       :user.fristName,
                                lastName        :user.lastName,
                                role            :user.role,
                                isEmailVerified :user.isEmailVerified   
                            }
                           
                        }
                    )
                }else{
                    res.status(401).json(
                        {
                            message : "invalid password.."
                        }
                    )
                }
            }
        }
    )
}

export function isAdmin(req){
    if(req.user == null){
        return false
    }
    if(req.user.role != "admin"){
        return false
    }

    return true
}

