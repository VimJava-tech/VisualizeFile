import { Component,ViewChild } from '@angular/core';
import { OnInit,Input } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ViewFile';
  enableTable:boolean=false;
  public csvRecords: any[] = [];
  searchTerm:string;
  dataArr:any = [];

  @ViewChild('fileImportInput',{static:false}) fileImportInput: any;

  fileChangeListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        if(this.csvRecords.length > 0)
          this.enableTable = true;
      };

      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = (<string>csvRecordsArray[i]).split(',');

      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA
      if (data.length == headerLength) {

        let csvRecord: CSVRecord = new CSVRecord();
        
        csvRecord.firstName = data[0].trim();
        csvRecord.lastName = data[1].trim();
        csvRecord.issueCount = data[2].trim();
        csvRecord.dob = data[3].trim();
        

        this.dataArr.push(csvRecord);
      }
    }
    return this.dataArr;
  }

  // CHECK IF FILE IS A VALID CSV FILE
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  // GET CSV FILE HEADER COLUMNS
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
    this.enableTable = false;
  }

  filterReset()
  {
    this.csvRecords = this.dataArr;
  }

  search()
  {
    this.csvRecords = this.dataArr.filter(res => {
      return res.issueCount.match(this.searchTerm);
    })
  }


}


export class CSVRecord {

  public firstName: any;
  public lastName: any;
  public issueCount: any;
  public dob: any;
   

  constructor() {

  }
}
