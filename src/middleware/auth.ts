import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken?.split(" ")[1];
      // console.log({token});

      if (!token) {
        return res.status(500).json({ message: "You are not allowed!!" })
      }

      else {
        const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
        console.log({ decoded });
        req.user = decoded;

        if(roles.length && !roles.includes(decoded.role as string)){
          return res.status(500).json({
            message: "Unauthorized!!"
          })
        }
        next();
      }
    }
    
    catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
}

export default auth;