import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import connnectToDB from "./db/db.connection.js";
import modulesRouter from "./modules/modules.routes.js";
import { ProjectMoodsEnum } from "./utils/constants/enum.constants.js";
async function bootstrap() {
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(morgan(process.env.MOOD === ProjectMoodsEnum.dev ? "dev" : "combined"));
    app.use(rateLimit({
        limit: 200,
        windowMs: 15 * 60 * 60 * 1000,
    }));
    if (!(await connnectToDB())) {
        app.use("{/*dummy}", (req, res) => {
            res.status(500).json({
                error: { message: "Something Went Wrong Please Try Again Later 🤔" },
            });
        });
    }
    else {
        app.use(["/", "/api/v1"], modulesRouter);
        app.use("{/*dummy}", (req, res) => {
            res.status(404).json({
                error: { message: `Wrong URI ${req.url} or METHOD ${req.method} ⛔` },
            });
        });
    }
    app.listen(process.env.PORT, (error) => {
        if (error) {
            console.log(`Error Starting the Server ❌: ${error}`);
        }
        console.log(`Server Started on PORT ${process.env.PORT} 🚀`);
    });
}
export default bootstrap;
