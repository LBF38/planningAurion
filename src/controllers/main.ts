import { Request, Response, NextFunction } from "express";

function index(req: Request, res: Response, next: NextFunction) {
  res.render("index");
}

export default { index };
