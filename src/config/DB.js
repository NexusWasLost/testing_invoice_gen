import mongoose from "mongoose";
import conf from "./config.js";

export async function connectDB() {
    const db = mongoose.connection;
    attachDBEventListeners(db);
    await mongoose.connect(conf.MONGO_URI);
}

function attachDBEventListeners(db) {
    db.on("connected", function () {
        console.log("Connected to database");
    });

    db.on("disconnected", function () {
        console.log("Disconnected from database");
    });

    db.on("error", function (error) {
        console.log("MongoDB connection error" + error);
    });
}
