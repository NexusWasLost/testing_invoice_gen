import { configDotenv } from "dotenv";
configDotenv();

const conf = {
    PORT: process.env.PORT || 8000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/invoice-gen-testing"
}

export default conf;
