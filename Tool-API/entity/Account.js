module.exports = class Account {
    constructor(args) {
        if(args) {
            if (args.profileId) {
                this.profileId = args.profileId;
            }
            if (args.provider) {
                this.provider = args.provider;
            }
        }
    }
}
