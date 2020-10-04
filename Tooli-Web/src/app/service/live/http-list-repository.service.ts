import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {List} from "../../entity/List";
import {ResponseHandler} from "../ResponseHandler";
import {ListRepositoryService} from "../contract/ListRepositoryService";

@Injectable({
  providedIn: 'root'
})
export class HttpListRepositoryService implements ListRepositoryService{
  private url = environment.api_url + 'list';

  constructor(
    private _http: HttpClient
  ) { }

  findAll(): Promise<List[]> {
    return new Promise<List[]>((resolve, reject) => {
      this._http.get(this.url)
        .subscribe(
          (response: any) => {
            new ResponseHandler().handleResponse(response, reject, () => {
              if (response && response.length) {
                const result: List[] = [];
                for(let list of response) {
                  result.push(new List(list));
                }
                resolve(result);
              } else {
                resolve([]);
              }
            });
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  insert(listName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._http.post(this.url, {name: listName})
        .subscribe(
          (response: any) => {
            new ResponseHandler().handleDefaultResponse(response, resolve, reject);
          },
          error => reject(error));
    });
  }

  update(changedList: List): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._http.put(this.url, {id: changedList.id, name: changedList.name})
        .subscribe(
          (response: any) => {
            new ResponseHandler().handleDefaultResponse(response, resolve, reject);
          },
          error => reject(error));
    });
  }

  delete(deletedList: List): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._http.delete(`${this.url}/${deletedList.id}`)
        .subscribe(
          (response: any) => {
            new ResponseHandler().handleDefaultResponse(response, resolve, reject);
          },
          error => reject(error));
    });
  }
}
