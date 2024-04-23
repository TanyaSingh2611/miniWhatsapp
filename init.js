const mongoose = require("mongoose");
const Chat = require("./models/chat.js");


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

let allChats= [{
    from: "Bharat",
    to:"priyal",
    msg:"isko ese nhi bolte h its called this",
    created_at: new Date(),
},
{
    from: "ankush",
    to:"ekata",
    msg:"katora le kr beth ja",
    created_at: new Date(),
},
{
    from: "shiva",
    to:"tanya",
    msg:"aee pagal phone rakh",
    created_at: new Date(),
},
{
    from: "sonu",
    to:"lolo",
    msg:"nikl yha se",
    created_at: new Date(),
},
{
    from: "rajnish",
    to:"swati",
    msg:"abhi time h baate kro na",
    created_at: new Date(),
}
];

Chat.insertMany(allChats);
