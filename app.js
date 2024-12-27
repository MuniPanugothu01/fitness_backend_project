import { config } from "dotenv";
config({ path: "./config.env" }); // config.env file accessing here

import express from "express";
import { sendEmail } from "./utils/sendEmail.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors'

const app = express(); // app express instance purpose created.
const router = express.Router(); // this is routing purpose created
app.use(bodyParser.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST"],
    credentials: true,
})); // this is middle ware. it used to connect front end backend

app.use(express.json()); // to parse the json
app.use(express.urlencoded({ extended: true })); // verification purpose, data coming form wheather it is string ot integer formate.

router.get("/", (req, res, next) => {
    res.json({ success: true, message: "This is running or not!" });
});
// router middle ware
app.use(router);


router.post("/send/mail", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {

        return next(
            res.status(400).json({
                success: false,
                message: "please provide the all details!"
            })
        );
    }

    try {
        await sendEmail({
            email: "munipanugothu266@gmail.com",
            subject: "Fitness Contact mail!",
            message,
            userEmail: email,
        });

        res.status(200).json({
            success: true,
            message: "Message sent successfully!",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server issues!",
        });
    }
});


mongoose
    .connect("mongodb+srv://munipanugothu2001:PqWSzYwnI5x2MKCX@fitnessdata.kcif8.mongodb.net/usersData", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Mongoose Schema and Model
const SubscriptionSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    package: { type: String, required: true },
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

// API Endpoint to handle form submission
app.post("/fitness/join", async (req, res) => {
    const { firstName, lastName, phoneNumber, email, package: selectedPackage } = req.body;

    if (!firstName || !lastName || !phoneNumber || !email || !selectedPackage) {
        return res.status(400).send({ message: "All fields are required" });
    }

    try {
        const newSubscription = new Subscription({
            firstName,
            lastName,
            phoneNumber,
            email,
            package: selectedPackage,
        });
        await newSubscription.save();
        res.status(201).send({ message: "Subscription saved successfully" });
    } catch (error) {
        console.error("Error saving subscription:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
app.get("/get", (req, res) => {
    res.json({ success: true, message: "server is running.... " });
})


const PORT = process.env.PORT || 3001;
console.log(PORT, 'this is port number!');

app.listen(PORT, () => {
    console.log(`Server is connected! ${PORT}`);
});


