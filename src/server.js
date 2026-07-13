import express from "express";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine("hbs", engine({ extname: ".hbs", layoutsDir: false, defaultLayout: false }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "template"));

app.get("/", function (req, res) {
    return res.status(200).json({
        message: "Server active"
    });
});

app.get("/invoice", async function (req, res) {
    try {
        const { name, price } = req.query;

        const basePrice = parseFloat(price || "100");
        const increasedPrice = basePrice + 50;
        const totalPrice = basePrice + increasedPrice;

        const context = {
            name: name || "Client Name",
            price: basePrice,
            increasedPrice,
            totalPrice
        };

        return res.render("invoice", context);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server errored"
        });
    }
});

// Vercel imports this app and handles requests itself — no listener needed there.
// Locally (npm run dev / node server.js), this starts a real server as usual.
if (!process.env.VERCEL) {
    app.listen(3000, function () {
        console.log("Server active on Port 3K");
    });
}

export default app;
