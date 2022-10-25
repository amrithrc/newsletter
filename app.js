const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const app=express();

//for using static file in our local like image and css
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res) {
var fName=req.body.fName;
var lName=req.body.lastname;
var email=req.body.email;

// data structure as per mailchimp api ,expecting in json string
const signData={
  members:[
    {
    email_address:email,
    status:"subscribed",
    merge_fields:{
      FNAME:fName,
      LNAME:lName
    }
  }]
}
 const jsonData=JSON.stringify(signData);

// make request to post data to external api
const url="https://us21.api.mailchimp.com/3.0/lists/77622cb526";
const option={
  method:"POST",
  auth:"amritha:ab2e3fb67ff10332a7509991068c2bc7-us21"
}
// saving https in a const so that we can use .write method to post data
const request=https.request(url,option,function(response){
response.on("data",function(data){
  console.log(JSON.parse(data));
if(response.statusCode===200)
{console.log("success");
res.sendFile(__dirname+"/success.html");
}
else{
  res.sendFile(__dirname+"/failure.html");

}
});
});

 request.write(jsonData);
 request.end();
})

// failure PAge
app.post("/failure",function(req,res){
  res.redirect("/")
});

app.listen(process.env.PORT||3000,function(){
  console.log("server is running on port 3000");
});

//
