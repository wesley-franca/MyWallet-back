import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); 

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect().then(() => {
        db = mongoClient.db("mywallet")
    });
} catch (error) {
    console.log(error.message);
}

export default db;