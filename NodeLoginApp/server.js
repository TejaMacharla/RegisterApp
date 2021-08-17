const express=require('express')
const mysql=require('mysql')
const bodyParser=require('body-parser')
const port="9999"


const app=express()

app.listen(port,function(){
    console.log(`server is running on port number ${port}`)
})
app.use(bodyParser.json()), app.use(bodyParser.urlencoded({ extended: !0 })), 
app.use(express.static(__dirname + "/app"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
var con = mysql.createConnection({
    connectionLimit: 20,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'mysql@123',
    database: 'loginapp',
    multipleStatements: true
});
con.connect(function (err) {
    if (err) {
        console.log('error occured while connecting :' + err);
    } else {
        console.log('connection created with Mysql successfully');
    }
});
app.post('/registration',(req,res)=>{
       const{first_name, last_name, gender, email, password, phone_number, nationality,description} = req.body
       con.query("INSERT INTO `loginapp`.`registration`( first_name, last_name, gender, email, password, phone_number, nationality,description)VALUES ('"+first_name+"', '"+last_name+"', '"+gender+"', '"+email+"', '"+password+"', '"+phone_number+"', '"+nationality+"','"+description+"')",(error,result)=>{
            if(error){
                console.log(error)
                return res.status(403).json({status:false,message:error.detail})
            }
            else{
                res.status(200).json({status:true,message:'you registered successfully',data:result})
                
            }
        })
    })
app.post('/login',(req,res)=>{
        const{first_name,email, password}=req.body
         con.query("select first_name,email, password from `loginapp`.`registration` where email='"+email+"'",(error,result)=>{
            // console.log(result)
               if (error) {
                   console.log(err);
                   
                }else{
                    
                    var Email=result[0].email
                    var Pwd=result[0].password
                    
                    if( Email==email&&Pwd==password ){
                     res.status(200).json({status:true,message:'you login successfully',FirstName:result[0].first_name,Email:result[0].email})

                     }
                       else{res.status(404).json({status:false,message:'invalid...username or password'})}
                }    
         })
})
    

    