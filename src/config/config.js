import { configDotenv } from "dotenv";
import Razorpay from "razorpay";
configDotenv();

const conf = {
    PORT: process.env.PORT || 8000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/invoice-gen-testing",
}

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY,
    key_secret: process.env.RAZORPAY_TEST_SECRET
});

export default conf;
