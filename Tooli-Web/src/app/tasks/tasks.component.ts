import {Component, Input, OnInit} from '@angular/core';
import { Task } from '../entity/Task';
import {List} from "../entity/List";
import {TaskService} from "../service/task.service";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  private _list: List = null;

  tasks: Task[] = [];
  error: any = null;

  constructor(
    private _taskService: TaskService
  ) { }

  ngOnInit(): void {
    this._updateTasks();
  }

  get list(): List {
    return this._list;
  }

  @Input()
  set list(value: List) {
    this._list = value;
    this._updateTasks();
  }

  private _updateTasks() {
    if (this._list != null) {
      this._taskService.findByListId(this._list.id)
        .then(tasks => {
          this.tasks = tasks;
        })
        .catch(err => {
          this.error = err;
          console.log(this.error);
        })
    }
  }
}
