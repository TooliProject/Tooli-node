import {Inject, Injectable} from '@angular/core';
import {TaskRepositoryService} from "./contract/TaskRepositoryService";
import { Task } from '../entity/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements TaskRepositoryService{

  constructor(
    @Inject("TaskRepositoryService")
    private _taskRepositoryService: TaskRepositoryService
  ) { }

  findByListId(id: number): Promise<Task[]> {
    return this._taskRepositoryService.findByListId(id);
  }
}
