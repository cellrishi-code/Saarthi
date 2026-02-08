const express = require("express");
const app = express();
const port = process.env.PORT||5050;
const path = require("path");
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));

const lec_data = require("./lectures_data.json");
const notes_data = require("./notes_data.json");

app.get("/",(req,res)=>{
  res.render("welcome");
})
app.get("/subjects",(req,res)=>{
  let dept=req.query.dept;
   let sem=req.query.sem;
 
if(!lec_data[dept] || !lec_data[dept][sem]){
      return res.render("error",{
          message:"Subjects not available yet"
      });
  }
const subj = Object.keys(lec_data[dept][sem]);

  if(subj.length === 0){
      return res.render("error",{
          message:"No subjects uploaded yet"
      });
  }
else
{
  res.render("subjects",{dept,sem,subj});

}


  
})

app.get("/resources",(req,res)=>{
  let dept=req.query.dept;
  let sem=req.query.sem;
  let sub = decodeURIComponent(req.query.sub || "").trim();

  if(
    !lec_data[dept] ||
    !lec_data[dept][sem] ||
    !lec_data[dept][sem][sub]
  ){
      return res.render("error",{
          message:"Resources not available yet"
      });
  }

  let topic = lec_data[dept][sem][sub];
  let notes = notes_data?.[dept]?.[sem]?.[sub] || [];

  res.render("resources",{sub,topic,notes});
});







app.listen(port,()=>{

  console.log(`app listening on port ${port}`);
})
