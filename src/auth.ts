import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { key } from "./constants";

export async function tokenValidation({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) {
  const token = req?.headers["authorization"];

  if (!token) {
    return res?.status(401).send("Unauthorized. No token provided");
  }

  let jwtHasError = false;

  jwt.verify(token, key, (error, decoded) => {
    if (error) {
      jwtHasError = true;
      return res.status(401).send(error.message);
    }
  });

  if (!jwtHasError) {
    return "validated";
  }
}
