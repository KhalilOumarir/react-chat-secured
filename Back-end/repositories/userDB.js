const repository=require("../repositories/repository");
const crypto=require("crypto");
const utils=require("util");
const scrypt=utils.promisify(crypto.scrypt);


class userDatabase extends repository{


    async create(attributes){
        const records=await this.getAll();
        attributes.id=this.randomID();//assign a random id to the user
        attributes.validationCode=crypto.randomBytes(64).toString("hex");//generate a validation code to send to the user
        attributes.validatedAccount=false;
        const salt=crypto.randomBytes(8).toString("hex");//generating a salt
        const buffer = await scrypt(attributes.password,salt,64);
        const record={
            ...attributes,
            password:`${buffer.toString("hex")}.${salt}`
        }
        records.push(record);
        await this.writeAll(records);
        return record;
    }
    async comparePasswords(saved,supplied){
        //saved->the password from our database
        //supplied->the password that is put when the user sign in aka req.body
        const [hashed,salt]=saved.split(".");
        const hashedSuppliedBuffer=await scrypt(supplied,salt,64);
        return hashed===hashedSuppliedBuffer.toString("hex"); 
        
    }

    async cryptPassword(password){
        const salt=crypto.randomBytes(8).toString("hex");
        const buffer=await scrypt(password,salt,64);
        return `${buffer.toString("hex")}.${salt}`;
    }

    async activateAccount(user){
        const records=await this.getAll();
        const id=user.id;
        const record=records.find(record=>record.id===id);
        if(record){
            record.validatedAccount=true;
            await this.writeAll(records);
        }else{
            console.log("Could not find the record");
        }
        
        
    }


}

module.exports=new userDatabase("user-databse.json","[]");