const fs=require("fs");
const crypto=require("crypto");


module.exports=class Repositories{
    constructor(filename,bracketType){
        if(!filename){
            throw new Error("a filename has not been passed.");
        }

        this.filename=filename;

        try{
            fs.accessSync(this.filename);
        }
        catch(err){
            fs.writeFileSync(this.filename,`${bracketType}`);
        }
    }

    async getAll(){
        return JSON.parse(await fs.promises.readFile(this.filename,{encoding:"utf-8"}));
    }

    async create(attributes){
        const records=await this.getAll();
        attributes.id=this.randomID();
        records.push(attributes);
        await this.writeAll(records);

        return attributes;
        
    }

    async writeAll(records){
        await fs.promises.writeFile(this.filename,JSON.stringify(records,null,2));
    }

     randomID(){
        
        return crypto.randomBytes(4).toString("hex");
    }

    async getOne(ID){
        let records=await this.getAll();
        return records.find(record =>record.id===ID);
    }

    async delete(ID){
        let records=await this.getAll();
        let filteredRecords=records.filter(record=>record.id!==ID);
        await this.writeAll(filteredRecords);
    }

    async update(ID,attributes){
        let records=await this.getAll();
        let record = records.find(record=>record.id===ID);
        if(!record){
            throw new Error("the record that is been looked for hasn't been found.");
        }
        Object.assign(record,attributes);
        await this.writeAll(records);
    }

    async getOneby(filters){
        
        let records=await this.getAll();
        for(let record of records){
            let found=false;
            for(let key in filters){
                if(record[key]===filters[key]){
                    found=true;
                }
            }
            if(found){
                return record;
            }
        }
        
       
    }

   

}