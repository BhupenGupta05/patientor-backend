import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/user";

// Define a custom interface extending the Express Request interface
interface CustomRequest extends ExpressRequest {
    token?: string | null;
    user?: object | null;
    path: string;
}

const tokenExtractor = (req: CustomRequest, _res: Response, next: NextFunction) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.replace("Bearer ", "");
    
    req.token = token;
  } else {
    req.token = null;
  }
  next();
};

const isJwtPayload = (token: any): token is JwtPayload => {
  return typeof token === "object" && "id" in token;
};

const userExtractor = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.token;
  console.log("Token: ", token);
    
  
  if (!token) {
    return res.status(401).json({ error: "token missing" });
  }
  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

    if(isJwtPayload(decodedToken)) {
      console.log("Decoded token: ",decodedToken);

      if (!decodedToken.id) {
        return res.status(401).json({ error: "token invalid" });
      }
    
      const user = await User.findById(decodedToken.id);
      console.log("User: ", user);
        
    
      if (!user) {
        return res.status(401).json({ error: "user not found" });
      }
    
      req.user = user;
      next();
    }
    return;
      
  } catch (error) {
    return res.status(401).json({ error: "token invalid" });
  }
};

const requestLogger = (req: CustomRequest & { path: string }, _res: Response, next: NextFunction) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

const unknownEndpoint = (_req: CustomRequest, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error: Error, _req: CustomRequest, res: Response, next: NextFunction) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name ===  "JsonWebTokenError") {    
    return res.status(400).json({ error: "invalid token" }); 
  } else if (error.name === "TokenExpiredError") {    
    return res.status(401).json({ error: "token expired" });
  }
  next(error);
  return;
};

export default {
  tokenExtractor,
  userExtractor,
  requestLogger, 
  unknownEndpoint,
  errorHandler
};
