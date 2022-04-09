import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Osoba} from "../../../../../models/osoba.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-osoby-zoznam',
  templateUrl: './osoby-zoznam.component.html',
  styleUrls: ['./osoby-zoznam.component.css']
})
export class OsobyZoznamComponent implements OnInit, OnChanges {
  filtering: FormGroup;
  page: number = 1;
  pageSize: number = 10;
  collectionSize: number;
  isCollapsed: boolean = true;
  @Input() isLoaded: boolean;
  @Input() osoby: Osoba[] = [];
  osobySlice: Osoba[] = [];

  @Output()
  editOsoba: EventEmitter<number> = new EventEmitter<number>();

  edit(id: number): void { this.editOsoba.emit(id); }

  constructor() {
    this.filtering = new FormGroup({
      id: new FormControl(null, [
        Validators.min(0),
        Validators.required
      ]),
      fName: new FormControl(null, [
        Validators.minLength(1),
        Validators.required
      ]),
      lName: new FormControl(null, [
        Validators.minLength(1),
        Validators.required
      ]),
    });
  }

  // TODO REGEX
  refreshTable(): void {
    this.refreshOsoby();
    if(this.filtering.dirty) {
      this.osobySlice = this.filterOut();
      this.refreshSearch();
    }
  }

  private refreshOsoby(): void {
    this.collectionSize = this.osoby.length;
    this.osobySlice = this.osoby.map((o, i) => ({id: i + 1, ...o}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  private refreshSearch(): void {
    this.collectionSize = this.osobySlice.length;
    this.osobySlice = this.osobySlice.map((o, i) => ({id: i + 1, ...o}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  private filterOut(): Osoba[] {
    var filter: any;
    let filtred: Osoba[] = this.osoby;
    if(this.filtering.controls['id'].valid) {
      filter = this.filtering.controls['id'].value.toString();
      filtred = filtred.filter((person: Osoba) => {
        return person.id.toString(10).match(filter);
      });
    }
    if(this.filtering.controls['fName'].valid){
      filter = this.filtering.controls['fName'].value.toLocaleLowerCase();
      filtred = filtred.filter((person: Osoba) => {
        return person.firstName.toLocaleLowerCase().match(filter);
      });
    }
    if(this.filtering.controls['lName'].valid){
      filter = this.filtering.controls['lName'].value.toLocaleLowerCase();
      filtred = filtred.filter((person: Osoba) => {
        return person.lastName.toLocaleLowerCase().match(filter);
      });
    }
    return filtred;
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if(this.isLoaded == true) { this.refreshOsoby(); }
  }
}
