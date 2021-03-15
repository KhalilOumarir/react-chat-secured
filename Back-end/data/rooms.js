class Rooms{
    constructor(namespace,namespaceTitle,roomsArray){
        this.namespace=namespace;
        this.roomsAvailable=roomsArray;
        this.namespaceTitle=namespaceTitle;
    }

    Rooms(){
        return this.roomsAvailable;
    }
    NsTitle(){
        return this.namespaceTitle;
    }
    NsUrl(){
        return this.namespace;
    }
    
}



module.exports=Rooms;