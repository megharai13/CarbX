class HttpError extends Error{
    constructor(message,errorCode){
        super(message); //Adds a "Message" property
        this.code=errorCode; //Adds a "Code" property
    }
}
module.exports=HttpError;