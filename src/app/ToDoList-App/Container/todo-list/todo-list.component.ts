import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToDoListService } from '../../Service/to-do-list.service';
import { ToDoClass } from '../../Service/to-do-class';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
declare var window: any;
import * as $ from 'jquery';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  @ViewChild('numericInput') numericInput!: ElementRef;
  toDoList: ToDoClass[] = [];
  AddTaskForm!:FormGroup;
  today: number = Date.now();
  formModal: any; // define a variable
  dropdownOptions: string[] = ['Completed','Pending','In-Progress'];
  selectedOption: string = '';
  selectedDate: string = '';
  TaskName:any;
  Date:any;
  TaskStatus:any;
  Id:any;
  deletedId:any;
  dataUpdateByOption:any;
  // task:any={taskStatus:''}
  TotalCount:any
  p: any = 1;
  page: any = 1;
  count: any = 5;
pageSizeOptions = "[5, 10, 25, 100]" // Options for number of items per page
checkboxValue: boolean = false;
PendingTask:any= 0;
InProgressTask:any= 0;
isInputDisabled: boolean = true;
BoolForAddData:boolean = false;
// jquery 


constructor(private service: ToDoListService,private formBuilder: FormBuilder,private cdr: ChangeDetectorRef) {}

  detectChanges() {
    this.cdr.detectChanges();
  }

  //open for common modal 
  openModal(modal: any) {
    const modelDiv = document.getElementById(modal);
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }
  //for specfic delete option open modal
  openDeleteModal(modal: any,id:any) {
    this.deletedId = id;
    const modelDiv = document.getElementById(modal);
    if (modelDiv != null) {
      modelDiv.style.display = 'block';
    }
  }
  // for modal close
  closeModal(modal: any) {
    const modelDiv = document.getElementById(modal);
    if (modelDiv != null) {
      modelDiv.style.display = 'none';
    }
    window.location.reload();
  }

  ngOnInit(): void {
    this.GetToDoTaskData();
    //Form Related
    this.AddTaskForm = this.buildForm();
    this.cdr.detectChanges();
    this.remaining();  

  }
 
  GetToDoTaskData()
  {
  this.service.getToDoListData().subscribe((res: any) => {
    this.toDoList = res;
    console.log(this.toDoList);
    this.SelectStatus();
  });
}
  //Form Related
  private buildForm()
  {
    return this.formBuilder.group({
      TaskName:['',[Validators.required,Validators.pattern("^[a-zA-Z ]*$")]],
      TaskStatus: ['',[Validators.required]],
      Date:['',[Validators.required]],
      Id:['',[Validators.required]]
    })
  }
 
// select option
  selectOption(event: any,id:any) {
    this.selectedOption = event.target.value;
    //set taskStatus for this id
    for(let val of this.toDoList)
    {
      if(val.id === id)
      {
        val.taskStatus = this.selectedOption
      }
    }
    this.SelectStatus();
    // Set TaskStatus value in form
    this.AddTaskForm.patchValue({
      TaskStatus: this.selectedOption
      
    });
   //TaskStatus Update by id in database
   if(id != null)
   {
    // Get data from database using id
     this.service.getToDoListDataByID(id).subscribe((res:any) =>{
      this.dataUpdateByOption = res;
      this.dataUpdateByOption.taskStatus = this.selectedOption;
      //update taskStatus
      this.service.updateToDoListData(this.dataUpdateByOption).subscribe((res:any) => {
        console.log("up"+res.taskStatus);
      });
     
     });
     
    }
  
  }

  // Select Status
  SelectStatus()
  {
    this.PendingTask = 0;
    this.InProgressTask = 0;
    //geting all select checkbox condition
    for(let val of this.toDoList)
      {
        if(val.taskStatus === "Completed")
        {
          
          this.checkboxValue = true
        }
        if(val.taskStatus === "Pending")
        {
          this.checkboxValue = false;
          break;
        }
        if(val.taskStatus === "In-Progress")
        {
          this.checkboxValue = false;
          break;
        }
      }
      //count Pending and In-Progress data
      for(let val of this.toDoList)
      {
        if(val.taskStatus === "Completed")
        {
          this.PendingTask++;
        }
        if(val.taskStatus === "In-Progress")
        {
          this.InProgressTask++;
        }
      }
  }
// delete to do Task
  deleteToDoTask(Id: any) {
    this.service.deleteToDoListData(Id).subscribe(() => {
      console.log('Succcess');
    });
    alert("Data Deleted");
    window.location.reload();
  }
// Add to Do Task
  addToDoTask(data: any) {
    for(let val of this.toDoList)
    {
     if(val.id == data.Id)
     {
        this.BoolForAddData = true;
        break;
     }
     else{
      this.BoolForAddData = false;
      
     }

    }
    if(!this.BoolForAddData)
    {

      console.log(data);
      data = JSON.stringify(data);
      console.log("Add function"+data);
      this.service.AddToDoListData(data).subscribe((res) => {
        console.log("Add Function"+res);
      });
      alert("Data Successfull saved");
      window.location.reload();
    }
    else{
      alert("Data already exist");
    }
  }

  // Update to do task 
  updateToDoTask(dataForUpdate: any) {
    dataForUpdate = JSON.stringify(dataForUpdate.value);
    console.log("Update"+dataForUpdate);
    this.service.updateToDoListData(dataForUpdate).subscribe((res:any) => {
      console.log("Successfull"+res);
    });
    alert("Data  Updated successfull");
    window.location.reload();
  }

  //Get To Do Task by id
  GetToDoDataById(Id:any)
  {
     this.service.getToDoListDataByID(Id).subscribe((res:any) =>{
      this.TaskName = res.taskName;
      this.TaskStatus = res.taskStatus;
      this.Date = res.date;
      this.Id = res.id;
      console.log(res);
     
      this.AddTaskForm =  this.formBuilder.group({
        TaskName:[this.TaskName,[Validators.required,Validators.pattern("^[a-zA-Z ]*$")]],
        TaskStatus:[this.TaskStatus,[Validators.required]],
        Date:[this.Date],
        Id:[this.Id]
      })
    })
  }
 
  UpdateTaskStatusbyID(Id:any,TaskStatus:any)
  {
    this.service.UpdateTaskStatusById(Id,TaskStatus).subscribe((res:any)=>
    {
      console.log(res);
    });
  }
  remaining(): any {
    this.TotalCount =  this.toDoList.length;
  }

  // updating all TaskStatus on select all checkbox 
  onCheckboxChange() {
    console.log('Checkbox value:', this.checkboxValue);
    if(this.checkboxValue)
    {
      for(let val of this.toDoList)
      {
        console.log(val);
        val.taskStatus='Completed'
        this.UpdateTaskStatusbyID(val.id,val.taskStatus)
      }
    }
    if(!this.checkboxValue)
    {
      for(let val of this.toDoList)
      {
        console.log(val);
        val.taskStatus='Pending'
        this.UpdateTaskStatusbyID(val.id,val.taskStatus)
      }
    }
    // gor getting pending and inprogress count
    this.SelectStatus();
  }

  onKeyPress(event: KeyboardEvent) {
    const keyCode = event.which ? event.which : event.keyCode;

    if (!(keyCode >= 48 && keyCode <= 57)) {
      this.showErrorMessage();
      event.preventDefault(); // Prevent non-numeric characters from being entered
    } else {
      this.hideErrorMessage();
    }
  }

  showErrorMessage() {
    const errorIdElement = this.numericInput.nativeElement.nextElementSibling;
    errorIdElement.style.display = 'inline';
  }

  hideErrorMessage() {
    const errorIdElement = this.numericInput.nativeElement.nextElementSibling;
    errorIdElement.style.display = 'none';
  }
}
  

