const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main()
.then(()=>{
    console.log("connection is successful");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

// let chat1 = new Chat({
//     from: "neha",
//     to:"priya",
//     msg:"send me your exam notes",
//     created_at: new Date(),
// })

// chat1.save()
// .then((res)=>{
//     console.log(res);
// })
// .catch((err)=>{
//     console.log(err);
// })

app.get("/",(req,res)=>{
    res.send("root is working ");
})

//search
app.post("/chats/search",async(req,res,next)=>{
    try{
        let {from: newfrom} = req.body;
        console.log(newfrom);
        let Chats = await Chat.find({from:newfrom});
        //console.log(Chats);
        res.render("search.ejs",{Chats})
    }catch(err){
        next(err);
    }
    
})

function asyncWrap(fn){
    return function(req,res,next){
         fn(req,res,next).catch((err) => next(err));
    }
}

//new - Show Route
app.get("/chats/:id", asyncWrap(async(req,res,next)=>{
    
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if(!chat){
            next( new ExpressError(404,"chat not found"));
        }
        res.render("edit.ejs",{chat});

   
}))

//index route
app.get("/chats", asyncWrap(async(req,res,next)=>{
      
        let chats= await Chat.find({});
        //console.log(chats);
        res.render("index.ejs",{chats});
      
      
}));


//New Route 
app.get("/chat/new",(req,res)=>{
    //throw new ExpressError(404,"page not found");
    try{
        res.render("new.ejs");
    }catch(err){
        next(new ExpressError(404,"page not found"));
    }
   
});

app.post("/chats",asyncWrap(async(req,res,next)=>{
   
        let {from,to,msg} = req.body;
        let newChat = new Chat({
            from: from,
            to:to,
            msg: msg,
            created_at: new Date(),
        })
        await newChat.save();
        res.redirect("/chats");

   
}));

//Edit route
app.get("/chats/:id/edit",asyncWrap(async(req,res,next)=>{
  
        let {id} = req.params;
     //console.log(id);
    let chat = await Chat.findById(id);
    //console.log(chat.from);
    res.render("edit.ejs" ,{chat});
    
     
}))

//Update Route
app.put("/chats/:id",asyncWrap( async(req,res,next)=>{
   
        let {id} = req.params;
    let {msg:newMsg} = req.body;

    let updatedChat = await Chat.findByIdAndUpdate(id,
        {msg:newMsg},
        {runValidators:true, new:true}
    );
    //console.log(updatedChat);
    res.redirect("/chats");
    
    
}));

//delete route
app.delete("/chats/:id",asyncWrap(async(req,res,next)=>{
  
        let {id} =req.params;

        let deletedChat = await Chat.findByIdAndDelete(id);
       // console.log(deletedChat);
        res.redirect("/chats");
    
  

}))

const handleValidationError = (err)=>{
  console.log("This was a Validation Error Please follow rules");
  console.dir(err.name);
  return err;   
}

app.use((err,req,res,next)=>{
     console.log(err.name);
     if(err.name == "ValidationError"){
        err = handleValidationError(err)
     }
     next(err);
})

//error handling middleware
app.use((err,req, res,next)=>{
    let {status=500,message="Some Error Occured"} = err;
    res.status(status).send(message);
})

app.listen(8080, (req,res)=>{
    console.log("Server is listening on port 8080");
})