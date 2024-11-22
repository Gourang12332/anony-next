
import mongoose from "mongoose";
type ConnectionObject = {
    isConnected?: number
}
const connection : ConnectionObject = {} // created an object of type connectionobject , isConnected is a number
export default async function dbconnect () : Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database")
        return ;
    } // to avoid performance choking we have checked that either firt there exist a connection or not
    try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '' , {}) // connecting database
    console.log("I am printing the db itself : " + db);

    connection.isConnected = db.connections[0].readyState // this is the number which was above returned; that is stored in connection.isConnected
    console.log("db connected successfully")
    } catch (error) {
        console.log("Database connection failed")
        process.exit(1)
    }

}
