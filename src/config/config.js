import { configDotenv } from "dotenv";
configDotenv();

const conf = {
    PORT: process.env.PORT || 8000,
}

export default conf;
