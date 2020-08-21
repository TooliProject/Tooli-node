module.exports = class Entry {
    constructor(id, text, status, created, finished){
        this.id = id;
        this.text = text;
        this.status = status;
        this.created = created;
        this.finished = finished;
    }
}; 