import {Component, Input, OnInit} from '@angular/core';
import { Task } from 'src/app/entity/Task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  private _task: Task = null;

  constructor() { }

  ngOnInit(): void {
  }


  get task(): Task {
    return this._task;
  }

  @Input()
  set task(value: Task) {
    this._task = value;
  }

  done() {
    this.task.done = !this.task.done;
  }
}
