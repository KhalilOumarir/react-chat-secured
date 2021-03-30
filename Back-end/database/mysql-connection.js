const mysql=require("mysql");



const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'chat_app'
})


module.exports=connection