module.exports = class Account {
    constructor(id, name, myListId, email, password, status){
        this.id = id;
        this.name = name;
        this.myListId = myListId;
        this.email = email;
        this.password = password;
        this.status = status;
    }
}; 