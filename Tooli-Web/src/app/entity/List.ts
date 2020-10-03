export class List {
  private _id: number;
  private _name: string;
  private _created: Date;

  constructor(args?: {
    id?: number,
    name?: string,
    created?: string
  }) {
    if(args) {
      if(args.id) {
        this.id = args.id;
      }
      if(args.name) {
        this.name = args.name;
      }
      if (args.created) {
        this.created = new Date(args.created);
      }
    }
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get created(): Date {
    return this._created;
  }

  set created(value: Date) {
    this._created = value;
  }
}
