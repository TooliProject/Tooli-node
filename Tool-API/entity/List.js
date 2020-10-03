module.exports = class List {
    constructor(args) {
        if(args) {
            if (args.id) {
                this.id = args.id;
            }
            if (args.name) {
                this.name = args.name;
            }
            if (args.created) {
                this.created = args.created;
            }
        }
    }
}
