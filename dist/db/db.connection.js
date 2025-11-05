import mongoose from "mongoose";
async function connnectToDB() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log(`Connected to DB Successfully 👌`);
        return true;
    }
    catch (e) {
        console.log(`Failed to Connect to DB ☠️`, e);
        return false;
    }
}
export default connnectToDB;
