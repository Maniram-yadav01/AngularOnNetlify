import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
  @Input() toDoSearch?: string = '';
  @ViewChild('numericInput') numericInput!: ElementRef;
  toDoList: ToDoClass[] = [];
  filterItemsdata: ToDoClass[] = [];
  AddTaskForm!:FormGroup;
  today: number = Date.now();
  formModal: any; // define a variable
  dropdownOptions: string[] = ['Completed','Pending','In-Progress'];
  selectedOption: string = '';
  selectedDate: string = '';
  TaskName:any;
  Date:any;
  Time:any;
  DateTime:any
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
dataforAdd = {
  TaskName:'',
  TaskStatus:'',
  Id:'',
  Date:''
}
dataForUpdate1:any
searchText: string = '';
isDropdownOpen = false;
filterStatus:string = '';


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

  async ngOnInit() {
     this.GetToDoTaskData();
    //Form Related
    this.AddTaskForm = this.buildForm();
    this.cdr.detectChanges();
    this.remaining();  
    this.AddTaskForm.get('Time')?.valueChanges.subscribe((time: string) => {
      this.updateDateTime();
    });

    this.AddTaskForm.get('Date')?.valueChanges.subscribe((date: string) => {
      this.updateDateTime();
    });

  }
  updateDateTime() {
    const time = this.AddTaskForm.get('Time')?.value;
    const date = this.AddTaskForm.get('Date')?.value;
    // Combine time and date into a single datetime string
    const dateTime = date +"T" + time+":"+"37.295Z";
    // Set the value of the DateTime field
    this.AddTaskForm.patchValue({ DateTime: dateTime });
  }


  GetToDoTaskData()
  {
  this.service.getToDoListData().subscribe((res: any) => {
    this.toDoList = res;
    this.SelectStatus();
  });
}
  //Form Related
  private buildForm()
  {
    return this.formBuilder.group({
      TaskName:['',[Validators.required,Validators.pattern("^[a-zA-Z ]*$")]],
      TaskStatus: ['',[Validators.required]],
      Time:['',[Validators.required]],
      Date:['',[Validators.required]],
      DateTime:[''],
      Id:['',[Validators.required]],
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
      this.dataUpdateByOption.date = this.dataUpdateByOption.date+"Z"
      this.service.updateToDoListData(this.dataUpdateByOption).subscribe((res:any) => {
      });
     
     });
     
    }
  
  }

  selectOptionStatus(event:any)
  {
    console.log("oo"+event.target.value);
    this.filterStatus = event.target.value;
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
      this.dataforAdd.TaskName = data.TaskName;
      this.dataforAdd.TaskStatus = data.TaskStatus;
      this.dataforAdd.Id = data.Id;
      this.dataforAdd.Date = data.DateTime;
      data = JSON.stringify(this.dataforAdd);
      this.service.AddToDoListData(data).subscribe((res) => {
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

    dataForUpdate.value.Date = dataForUpdate.value.Date+"Z";
     this.dataForUpdate1 = JSON.stringify(dataForUpdate.value);
    this.service.updateToDoListData(this.dataForUpdate1).subscribe((res:any) => {
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
    });
  }
  remaining(): any {
    this.TotalCount =  this.toDoList.length;
  }

  // updating all TaskStatus on select all checkbox 
  onCheckboxChange() {
    if(this.checkboxValue)
    {
      for(let val of this.toDoList)
      {
        val.taskStatus='Completed'
        this.UpdateTaskStatusbyID(val.id,val.taskStatus)
      }
    }
    if(!this.checkboxValue)
    {
      for(let val of this.toDoList)
      {
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

  filterItems() {
    // Implemented search filtering logic here
    //  filter based on taskName containing searchText
    if ( this.filterStatus === 'Completed') {
      return  this.toDoList.filter(item => item.taskStatus.toLowerCase().includes(this.filterStatus?.toLowerCase()));
      // Reset filter
    } 
    if ( this.filterStatus === 'Pending') {
      return  this.toDoList.filter(item => item.taskStatus.toLowerCase().includes(this.filterStatus?.toLowerCase()));
      // Reset filter
    } 
    if ( this.filterStatus === 'In-Progress') {
      return  this.toDoList.filter(item => item.taskStatus.toLowerCase().includes(this.filterStatus?.toLowerCase()));
      // Reset filter
    } 
    
      // this.filteredTasks = this.tasks.filter(task => task.status === status);
      return this.toDoList.filter(item => item.taskName.toLowerCase().includes(this.toDoSearch?.toLowerCase()));
    
  }
}
  

