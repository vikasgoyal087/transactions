import { Component, OnInit } from '@angular/core';
import { TransactionLocalStorageService } from 'src/app/service/transaction-local-storage.service';
import { TransactionServiceService } from 'src/app/service/transaction-service.service';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
declare var $: any;

@Component({
  selector: 'app-transaction-add',
  templateUrl: './transaction-add.component.html',
  styleUrls: ['./transaction-add.component.scss']
})
export class TransactionAddComponent implements OnInit {
  txService: any;
  transaction: any = {};
  errors: any = {};
  supports_webSQL: boolean = true;
  transactionService: any;
  constructor(private txServiceWeb: TransactionServiceService, private txServiceLocal: TransactionLocalStorageService, private transactionList: TransactionListComponent) {
    
  }

  ngOnInit(): void {
    this.supports_webSQL = ("openDatabase" in window);
    this.transactionService = (this.supports_webSQL) ? this.txServiceWeb : this.txServiceLocal;
  }

  validate(){
    let err = false;
    this.errors = {};
    if(!this.transaction.name){
      this.errors.name = "Name is required.";
      err = true;
    }
    if(!this.transaction.amount){
      this.errors.amount = "Amount is required.";
      err = true;
    }
    if(!this.transaction.description){
      this.errors.description = "Description is required.";
      err = true;
    }
    if(!this.transaction.type){
      this.errors.type = "Type is required.";
      err = true;
    }
    if(!this.transaction.date){
      this.errors.date = "Date is required.";
      err = true;
    }
    return !err;
  }

  addTransaction(){
    if(this.validate()){
      this.transactionService.addRecord(this.transaction).then((response: any) => {
          this.transactionList.getTotalSavings();
          this.transactionList.getList();
          this.transactionList.success = "Transaction inserted successfully.";
          this.transaction = {};
          $('#addTransactionModal').modal('toggle');
          setTimeout(() =>{
            this.transactionList.success = "";
          }, 5000);
      }).catch((ex: any) => {
        this.transactionList.error = "Transaction not inserted.";
        setTimeout(() =>{
          this.transactionList.error = "";
        }, 5000);
      });
    }
  }

}
