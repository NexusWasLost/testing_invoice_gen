import { configDotenv } from "dotenv";
import Razorpay from "razorpay";
configDotenv();

const conf = {
    PORT: process.env.PORT || 8000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/invoice-gen-testing",
    RZP_KEY_SECRET: process.env.RAZORPAY_TEST_SECRET,
    RZP_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET
}

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY,
    key_secret: process.env.RAZORPAY_TEST_SECRET
});

export default conf;
