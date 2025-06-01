const mongoose = require('mongoose')



mongoose.connect(process.env.DB_URI)
.then(()=>{
    console.log("Connection is Established!");
})
.catch((err)=>{
    console.log(`Error in connection : ${err}`);
})