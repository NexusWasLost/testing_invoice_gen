import express from "express";
import conf from "./config/config.js";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import * as path from "path";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import { connectDB } from "./config/DB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));

app.engine("hbs", engine({ extname: ".hbs", layoutsDir: false, defaultLayout: false }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "template"));

app.get("/", function (req, res) {
    return res.status(200).json({
        message: "Server active"
    });
});

import invoiceRouter from "./routes/invoice.route.js";
import itemRouter from "./routes/item.route.js";
app.use("/api/invoice", invoiceRouter);
app.use("/api/item", itemRouter);

app.use(errorHandler);

// Vercel imports this app and handles requests itself — no listener needed there.
// Locally (npm run dev / node server.js), this starts a real server as usual.
if (!process.env.VERCEL) {
    app.listen(conf.PORT, function () {
        console.log(`Server active on Port ${ conf.PORT }`);
    });
}

export default app;
