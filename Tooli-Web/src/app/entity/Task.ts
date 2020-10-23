export class Task {
  private _id: number;
  private _description: string;
  private _created: Date;
  private _done: boolean;
  private _listId: number;

  constructor(args?: {
    id?: number,
    description?: string,
    created?: string,
    done?: boolean,
    listId?: number
  }) {
    if(args) {
      if(args.id) {
        this.id = args.id;
      }
      if (args.description) {
        this.description = args.description;
      }
      if (args.created) {
        this.created = new Date(args.created);
      }
      if (args.done) {
        this.done = args.done;
      }
      if(args.listId) {
        this.listId = args.listId;
      }
    }
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get created(): Date {
    return this._created;
  }

  set created(value: Date) {
    this._created = value;
  }

  get done(): boolean {
    return this._done;
  }

  set done(value: boolean) {
    this._done = value;
  }

  get listId(): number {
    return this._listId;
  }

  set listId(value: number) {
    this._listId = value;
  }
}
