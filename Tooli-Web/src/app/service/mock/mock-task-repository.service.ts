import { Injectable } from '@angular/core';
import {TaskRepositoryService} from "../contract/TaskRepositoryService";
import {Task} from "../../entity/Task";

@Injectable({
  providedIn: 'root'
})
export class MockTaskRepositoryService implements TaskRepositoryService{
  private _tasks = [
    new Task({
      id: 1,
      description: "Todo 1",
      created: new Date().toUTCString(),
      listId: 1,
      done: false
    }),
    new Task({
      id: 2,
      description: "Todo 2",
      created: new Date().toUTCString(),
      listId: 2,
      done: true
    }),
    new Task({
      id: 3,
      description: "Todo 3",
      created: new Date().toUTCString(),
      listId: 2,
      done: false
    }),
    new Task({
      id: 4,
      description: "Todo 4",
      created: new Date().toUTCString(),
      listId: 1,
      done: true
    }),
  ];

  constructor() { }

  findByListId(id: number): Promise<Task[]> {
    return Promise.resolve(this._tasks.filter(t => t.listId === id));
  }
}
