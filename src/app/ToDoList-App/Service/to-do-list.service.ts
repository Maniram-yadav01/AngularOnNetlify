import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ToDoListService {

  constructor(private http: HttpClient) { }
  headers={
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
}
  getToDoListData() {
    // for iisServer
    // let url = 'http://localhost:81/ToDoList/GetToDoTaskData';
    // localhost
    // let url1 = 'https://localhost:5001/ToDoList/GetToDoTaskData';
    // for Railway
    let urlRailway = "https://mytodolistdata.up.railway.app/ToDoList/GetToDoTaskData";
    return this.http.get(urlRailway);
  }
  updateToDoListData(data:object) {
    // for IIS
     let urlIs = 'http://localhost:81/ToDoList/UpdateToDoTaskById'
    //  for localHost
    let url = 'https://localhost:5001/ToDoList/UpdateToDoTaskById';
    let urlRailway = "https://mytodolistdata.up.railway.app/ToDoList/UpdateToDoTaskById";
    return this.http.post(urlRailway,data,this.headers);
  }
  deleteToDoListData(id:any) {
    // for loalhost
    // return this.http.delete(`https://localhost:5001/ToDoList/DeleteToDoTaskData?Id=${id}`);
    // for IIs
    // return this.http.delete(`http://localhost:81/ToDoList/DeleteToDoTaskData?Id=${id}`);
    // for Railway
    return this.http.delete(`https://mytodolistdata.up.railway.app/ToDoList/DeleteToDoTaskData?Id=${id}`);
  }
  AddToDoListData(data:object) {
    let urlIss = 'http://localhost:81/ToDoList/CreateToDoTask'
    // let url = 'https://localhost:5001/ToDoList/CreateToDoTask';
    // for Railway
    let urlRailway = "https://mytodolistdata.up.railway.app/ToDoList/CreateToDoTask"
    return this.http.post(urlRailway,data,this.headers);
  }
  getToDoListDataByID(id:any) {
    // for localhost
    // return this.http.get(`https://localhost:5001/ToDoList/GetToDoTaskById?Id=${id}`);
    // for IIS 
    // return this.http.get(`http://localhost:81/ToDoList/GetToDoTaskById?Id=${id}`);
    // for Railway
    return this.http.get(`https://mytodolistdata.up.railway.app/ToDoList/GetToDoTaskById?Id=${id}`);
  }
  UpdateTaskStatusById(Id:any,TaskStatus:any)
  {
    // for localhost
    // let url = `https://localhost:5001/ToDoList/UpdateTaskStatusById?Id=${Id}&TaskStatus=${TaskStatus}`;
    // for IIs
    // let url = `http://localhost:81/ToDoList/UpdateTaskStatusById?Id=${Id}&TaskStatus=${TaskStatus}`;
    // for Railway
    let url = `https://mytodolistdata.up.railway.app/ToDoList/UpdateTaskStatusById?Id=${Id}&TaskStatus=${TaskStatus}`;
    return this.http.put(url,null);
  }
}
