import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
})

export class DatatableComponent implements OnInit {
  //
  // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
  //
  // constructor: enable modal
  constructor(
    public dialog: MatDialog,
    // public departmentsService: DepartmentsService,
    private http: HttpClient,
    // form builder
    ) {
    }

  //
  // ─── INPUTS ─────────────────────────────────────────────────────────────────────
  //
  // table data
  @Input() dataUrl: string;
  @Input() mainRoute = '';
  @Input() getRoute = '';
  @Input() postRoute = '';
  @Input() putRoute = '';
  @Input() deleteRoute = '';

  // columns
  @Input() columns: { columnDef: string; header: string; type: string; required: boolean; vals: {}; options: string[] }[];
  //
  // ─── VARIABLES ──────────────────────────────────────────────────────────────────
  //
  // rows
  TEMP_DATA = [];
  displayedColumns: string[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  // FORM options
  errMsg = {};
  add = false;
  canEdit = false;
  dtFG: FormGroup;
  // data source
  dataSource: MatTableDataSource<Object>;
  // loading
  isLoading = true;
  errorMassage: string;
  // enable paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // enable sorting
  @ViewChild(MatSort) sort: MatSort;
  // enable searching
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

   // life cycle
   ngOnInit() {
    if (null == this.dataUrl ) { throw new Error('Attribute "dataUrl" is required'); }
    this.getMain().subscribe(
      res => {
        this.TEMP_DATA = res;
        // Auto generated columns
        if (null == this.columns) {
          this.columns = [];
          const names = Object.keys(this.TEMP_DATA[0]);
          names.forEach(element => {
            const x = {columnDef: element, header: element.toUpperCase(), type: 'text', required: true, vals : {}, options: [] };
            this.columns.push(x);

          });
        } else {
        }
        this.displayedColumns = this.columns.map(x => x.columnDef);
        this.dataSource = new MatTableDataSource<Object>(this.TEMP_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error => {
        this.errorMassage = <any>error;
        this.isLoading = false;
      }
    );
    this.creatForm();
  }

  //
  // ─── SERVICE ────────────────────────────────────────────────────────────────────
  //
  // get main (bonus route)
  getMain(): Observable<Object[]> {
    return this.http.get<Object[]>(this.dataUrl + this.mainRoute)
    .pipe(
    catchError(this.handleError)
    );
  }
  // get
  getReq(id): Observable<{}> {
    return this.http.get<Object[]>(this.dataUrl + this.getRoute + id )
    .pipe(
    catchError(this.handleError)
    );
  }
  // post
  postReq(body): Observable<{}> {
    return this.http.post<Object[]>(this.dataUrl + this.postRoute, body, this.httpOptions )
    .pipe(
    catchError(this.handleError)
    );
  }
  // put
  putReq(id, body): Observable<{}> {
    return this.http.put<Object[]>(this.dataUrl + this.putRoute + id , body, this.httpOptions )
    .pipe(
    catchError(this.handleError)
    );
  }
  // del
  delReq(id: number): Observable<{}> {
    return this.http.delete(this.dataUrl + this.deleteRoute + id, this.httpOptions )
    .pipe(
    catchError(this.handleError)
    );
  }
  // err
  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
        errorMessage = `An error occurrd : ${err.error.message}`;
    } else {
        errorMessage = `Server returned code : ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  //
  // ─── FORM ───────────────────────────────────────────────────────────────────────
  //
  openModal(templateRef, rowData) {
    const dialogRef = this.dialog.open(templateRef, {
        disableClose: true,
        data: rowData,
        minWidth: '50vh',
    });
    if (!rowData) {
      this.add = true;
      this.dtFG.enable();
    }
    // open
    dialogRef.afterOpened().subscribe(() => {
      // details
      if (rowData) {
        this.getReq(rowData.id).subscribe(
          res => {
            for (const key in this.dtFG.controls) {
              if (this.dtFG.controls.hasOwnProperty(key)) {
                const element = this.dtFG.controls[key];
                  element.setValue(res[key]);
              }
            }
          }
        );
      } else {
        // add
      }
    });
    // close
    dialogRef.afterClosed().subscribe(() => {
        this.add = false;
        this.dtFG.reset();
        this.dtFG.disable();
    });
  }
  onDelClick() {
    if (confirm(`Are you sure you want to delete? this can NOT be undone!`)) {
      this.delReq(this.dtFG.value.id).subscribe(
        res => { console.log(res); },
        err => { console.log(err); },
        () => {
          this.refresh();
          this.dialog.closeAll();
        }
      );
    }
  }
  tFn() {
    console.log(this.dtFG.value);
  }
  onSubmit() {
    if (this.dtFG.invalid) {
      return;
    }
    if (this.add) {
      // add
      const x = this.dtFG.value;
      delete  x.id;
       this.postReq(x).subscribe(
          res => { console.log(res); },
          err => { console.log(err); },
          () => {
            this.refresh();
            this.dialog.closeAll();
          }
       );
    } else  {
        // edit
        this.putReq(this.dtFG.value.id, this.dtFG.value).subscribe(
          res => {console.log(res); },
          err => {console.log(err); },
          () => {
            this.refresh();
            this.dialog.closeAll();
          }
        );
    }
  }
  editToggle() {
    if (this.dtFG.disabled) {
      this.dtFG.enable();
    } else {
      this.dtFG.disable();
    }
  }
  creatForm() {
    const x = {};
    for (const f of this.columns) {
      x[f.columnDef] = new FormControl('');
      this.errMsg[f.columnDef] = {};
      // if (f.required) {
      //   this.errMsg[f.columnDef]['required'] = 'this field is required';
      // }
      if (f.vals) {
        const valArr = [];
        for (const key in f.vals) {
          if (f.vals.hasOwnProperty(key)) {
            const element = f.vals[key];
              let valName = key.split('_').shift() ;
              const valPram = key.split('_').pop() ;
              switch (true) {
                case valName.toLowerCase() === 'minlength' || valName.toLowerCase() === 'minl':
                  valName = 'minLength';
                  break;
                case valName.toLowerCase() === 'maxlength' || valName.toLowerCase() === 'maxl':
                  valName = 'maxLength';
                  break;
                case valName.toLowerCase() === 'min':
                  valName = 'min';
                  break;
                case valName.toLowerCase() === 'max':
                  valName = 'max';
                  break;
                case valName.toLowerCase() === 'email':
                  valName = 'email';
                  break;
                case valName.toLowerCase() === 'pattern':
                  valName = 'pattern';
                  break;
                case valName.toLowerCase() === 'required' || valName.toLowerCase() === 'req':
                  valName = 'required';
                  break;
                default: console.error(`
                  validator ${valName} is not supported please add custom validator
                  or use [ required, email, min, max, minlength, maxlength,  pattern]`);
                  break;
              }
              this.errMsg[f.columnDef][valName.toLowerCase()] = element;
              if (valName === 'required' || valName === 'email') {
                valArr.push(Validators[valName]);
              } else  {
                valArr.push(Validators[valName](valPram));
              }
          }
        }
        x[f.columnDef].setValidators(valArr);
      }
    }
    this.dtFG = new FormGroup(x);
    this.dtFG.disable();
  }
  getErrorMsg(err, ctrl) {
    const x = Object.keys(err)[0];
    return this.errMsg[ctrl][x];
  }
  refresh() {
    this.getMain().subscribe(refData => {
    this.dataSource.data = refData;
    });
  }
}
