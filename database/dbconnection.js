import mongoose from "mongoose";

export const dbConnect =()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:"JOB_SEEKING",
    }).then(()=>{
        console.log("db Connected");
    })
    .catch((err)=>{
console.log(`munna err aa gya ${err}`)
    })
}
