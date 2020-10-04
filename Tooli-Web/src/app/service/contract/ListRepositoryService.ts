import {List} from "../../entity/List";

export interface ListRepositoryService {
  findAll(): Promise<List[]>
  insert(listName: string): Promise<void>
  update(changedList: List): Promise<void>
  delete(deletedList: List): Promise<void>
}
