import { Router } from "express";

const modulesRouter: Router = Router();

modulesRouter.get("/", (req, res) => {
  res
    .status(200)
    .json({
      message: `Welcome to Our Graduation Project ${process.env.APP_NAME} ❤️ 🎓`,
    });
});

export default modulesRouter;
