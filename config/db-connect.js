require("mongoose").connect(process.env.DB_KEY).then(()=>{
  console.log("Datebase is Connected")
}).catch((err)=>{
  console.log(err)
})