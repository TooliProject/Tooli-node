import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {List} from "../../entity/List";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private _list: List = null;

  isEditing = false;
  listName = '';
  isDeleting = false;

  @Output()
  listChange = new EventEmitter<List>();
  @Output()
  listDelete = new EventEmitter<List>();

  constructor() { }

  ngOnInit(): void {
  }

  onListDoubleClick() {
    this.isEditing = true;
  }

  delete() {
    this.isDeleting = true;
  }

  confirmDelete() {
    this.listDelete.emit(this.list);
  }

  cancelDelete() {
    this.isDeleting = false;
  }

  get list(): List {
    return this._list;
  }

  @Input()
  set list(value: List) {
    this._list = value;
    this.listName = this._list.name;
  }

  onListNameKeyDown(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.key === 'Enter' ||
        keyboardEvent.key === 'Escape') {
      this.isEditing = false;

      if(keyboardEvent.key === 'Escape') {
        this.listName = this.list.name;
      } else {
        this.list.name = this.listName;
        this.listChange.emit(this.list);
      }
    }
  }
}
