import { Component } from '@angular/core';
import { ToDoListService } from './ToDoList-App/Service/to-do-list.service';
import { ToDoClass } from './ToDoList-App/Service/to-do-class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NgToDoListProject2024';
  searchText: string = '';
 
  
  constructor() {
  }

ngOnInit()
{

}
  
}
