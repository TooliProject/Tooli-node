import {Inject, Injectable} from '@angular/core';
import {ListRepositoryService} from "./contract/ListRepositoryService";
import {List} from "../entity/List";

@Injectable({
  providedIn: 'root'
})
export class ListService implements ListRepositoryService{

  constructor(
    @Inject('ListRepositoryService')
    private listRepositoryService: ListRepositoryService
  ) { }

  findAll(): Promise<List[]> {
    return this.listRepositoryService.findAll();
  }

  insert(listName: string): Promise<void> {
    return this.listRepositoryService.insert(listName);
  }

  update(changedList: List): Promise<void> {
    return this.listRepositoryService.update(changedList);
  }

  delete(deletedList: List): Promise<void> {
    return this.listRepositoryService.delete(deletedList);
  }


}
