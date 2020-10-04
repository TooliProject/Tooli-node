import { Injectable } from '@angular/core';
import {ListRepositoryService} from "../contract/ListRepositoryService";
import {List} from "../../entity/List";

@Injectable({
  providedIn: 'root'
})
export class MockListRepositoryService implements ListRepositoryService{

  private _nextId = 4;
  private _lists = [
    new List({id: 1, name: 'A Phantom List', created: new Date().toUTCString()}),
    new List({id: 2, name: 'Attack of the Clone List', created: new Date().toUTCString()}),
    new List({id: 3, name: 'Revenge of the Slist', created: new Date().toUTCString()}),
  ]

  constructor() { }

  findAll(): Promise<List[]> {
    return Promise.resolve(this._lists);
  }

  insert(listName: string): Promise<void> {
    this._lists.push(new List({
      id: this._nextId++,
      name: listName,
      created: new Date().toUTCString()
    }));
    return Promise.resolve(undefined);
  }

  update(changedList: List): Promise<void> {
    this._lists.find(list => list.id === changedList.id).name = changedList.name;
    return Promise.resolve();
  }

  delete(deletedList: List): Promise<void> {
    this._lists = this._lists.filter(list => list.id !== deletedList.id);
    return Promise.resolve();
  }

}
