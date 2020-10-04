import { Component, OnInit } from '@angular/core';
import {List} from "../entity/List";
import {HttpListRepositoryService} from "../service/live/http-list-repository.service";
import {ListService} from "../service/list.service";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  listName: string = '';
  lists: List[] = [];
  error: any = null;

  constructor(
    private _listService: ListService
  ) { }

  ngOnInit(): void {
    this._updateLists();
  }

  onSubmit() {
    if(this.listName && this.listName.length > 0) {
      this._listService.insert(this.listName)
        .then(() => {
          this._updateLists();
          this.error = null;
          this.listName = '';
        })
        .catch(err => {
          this.error = err;
          console.log(err);
        })
    }
  }

  private _updateLists() {
    this._listService.findAll()
      .then(lists => {
        this.lists = lists;
        this.error = null;
      })
      .catch(err => {
        this.error = err;
        console.log(this.error);
      });
  }

  onListChange(changedList: List) {
    this._listService.update(changedList)
      .then(() => {
        this._updateLists();
        this.error = null;
      })
      .catch(err => {
        this.error = err;
        console.log(this.error);
      })
  }

  onListDelete(deletedList: List) {
    this._listService.delete(deletedList)
      .then(() => {
        this._updateLists();
        this.error = null;
      })
      .catch(err => {
        this.error = err;
        console.log(this.error);
      });
  }
}
