
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { EmployeeData } from '../../employee.model';
import { EmployeeListPresenterService } from '../employee_list_presenter/employee-list-presenter.service';




@Component({
  selector: 'app-employee-list-presentation',
  templateUrl: './employee-list-presentation.component.html',
  styleUrls: ['./employee-list-presentation.component.scss'],
  viewProviders: [EmployeeListPresenterService],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListPresentationComponent implements OnInit {


  // Set Data for list
  @Input() public set employeeList(value : EmployeeData[] | null){
    console.log(value);
    if(value){
      this._employeeList = value;
    }
  }

  public get employeeList() : EmployeeData[] | null {
    return this._employeeList;
  }

  // Delete
  @Output() public delete : EventEmitter<number>
  
  private _employeeList! : EmployeeData[]

  constructor( private employeeListPresenter : EmployeeListPresenterService, private router: Router, private overlay : Overlay ) { 
    this.delete = new EventEmitter();
  }

  ngOnInit(): void {
    this.employeeListPresenter.delete$.subscribe((res: number) => {
      this.delete.emit(res);
    })    

    this.employeeListPresenter.filterData$.subscribe((res)=>{ 

      let filterdata = [...this._employeeList];

      let data = filterdata.map(item => { return Object.keys(item)});
      let datakey = data[0];
      console.log(datakey);
      
      datakey.forEach((item) => {
        if(res[item]){
          filterdata = filterdata.filter((data: any)=>{
            return data[item] == res[item]
          })
        }
      })
      console.log(filterdata)
      this._employeeList = filterdata

    });
  }

  // Delete
  public OnDelete(id : number){
    this.employeeListPresenter.onDelete(id);
  }

  // Edit
  onEdit(id: number) {
    this.router.navigateByUrl(`mvp/edit/${id}`);
  }

  // Open Overlay
  public filterOverlay(){
    this.employeeListPresenter.openFilter();
  }

}

  
