import {Inject, Injectable} from '@angular/core';
import {ListRepositoryService} from "./contract/ListRepositoryService";
import {List} from "../entity/List";

@Injectable({
  providedIn: 'root'
})
export class ListService implements ListRepositoryService{

  constructor(
    @Inject('ListRepositoryService')
    private _listRepositoryService: ListRepositoryService
  ) { }

  findAll(): Promise<List[]> {
    return this._listRepositoryService.findAll();
  }

  insert(listName: string): Promise<void> {
    return this._listRepositoryService.insert(listName);
  }

  update(changedList: List): Promise<void> {
    return this._listRepositoryService.update(changedList);
  }

  delete(deletedList: List): Promise<void> {
    return this._listRepositoryService.delete(deletedList);
  }


}
