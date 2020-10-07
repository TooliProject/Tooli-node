module.exports = class Task {
    constructor(args) {
        if(args) {
            if (args.id) {
                this.id = args.id;
            }
            if (args.description) {
                this.description = args.description;
            }
            if (args.created) {
                this.created = args.created;
            }
            if (args.done) {
                this.done = args.done;
            }
            if (args.listId) {
                this.listId = args.listId;
            }
        }
    }
}
