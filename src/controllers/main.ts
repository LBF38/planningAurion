import { Request, Response, NextFunction } from "express";

function index(req: Request, res: Response, next: NextFunction) {
  const deleteSuccess = req.cookies.delSuccess;
  res.clearCookie("delSuccess");
  res.render("index", { delSuccess: deleteSuccess });
}

export default { index };
