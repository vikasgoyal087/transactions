import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionLocalStorageService } from 'src/app/service/transaction-local-storage.service';
import { TransactionServiceService } from 'src/app/service/transaction-service.service';
declare var $: any;

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TransactionListComponent implements OnInit {
  totalSaving: any = 0;
  transactionData: any = [];
  db: any;
  deleteId: number = 0;
  success: any;
  error: any;
  totalItems: number = 0;
  page: number = 1;
  itemPerPage: number = 5;
  supports_webSQL: boolean = true;
  transactionService: any;
  constructor(private txServiceWeb: TransactionServiceService, private txServiceLocal: TransactionLocalStorageService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.supports_webSQL = ("openDatabase" in window);
    this.transactionService = (this.supports_webSQL) ? this.txServiceWeb : this.txServiceLocal;
    this.getList();
    this.getTotalSavings();
  }

  async getList() {
    let tData: any = [];
    let transactionData: any = await this.transactionService.fetchRecords();
    this.totalItems = transactionData.length;
    for(let i = 0; i < this.totalItems; i++){
      tData.push(transactionData[i]);
    }
    this.transactionData = tData;
  }

  async getTotalSavings() {
    this.totalSaving = await this.transactionService.fetchTotalSaving();
  }

  deleteRecord() {
    this.transactionService.deleteRecord(this.deleteId).then((response: any) => {
      this.getTotalSavings();
      this.getList();
      this.success = "Transaction deleted successfully.";
      $('#deleteTransactionModal').modal('toggle');
      setTimeout(() => {
        this.success = "";
      }, 5000);
    }).catch((ex: any) => {
      this.error = "Transaction not deleted.";
      setTimeout(() => {
        this.error = "";
      }, 5000);
    });
  }

  logout() {
    sessionStorage.removeItem("loggedin");
    this.router.navigate(['login']);
  }
}
