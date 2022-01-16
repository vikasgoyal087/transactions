import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionLocalStorageService {

  db: any;
  noOfRecord: number = 0;
  lastRowId: any = 0;
  transactionRecords: any = [];
  totalSavings: number = 0;
  totalIncome: number = 0;
  totalExpense: number = 0;

  constructor() {

  }

  fetchTotalSaving() {
    this.totalIncome = 0;
    this.totalExpense = 0;
    let transactions = localStorage.getItem('TRANSACTIONS');
    if (transactions) {
      this.transactionRecords = JSON.parse(transactions);
      this.transactionRecords.map((m: any) => {
        if (m.type == "Income") {
          this.totalIncome += Number(m.amount);
        } else if (m.type == "Expense") {
          this.totalExpense += Number(m.amount);
        }
      });
      this.totalSavings = this.totalIncome - this.totalExpense;
    }

    return this.totalSavings;
  }

  fetchRecords() {
    this.fetchTotalSaving();
    return this.transactionRecords;
  }

  addRecord(data: any) {
    return new Promise((resolve, reject) => {
      let noOfRecords = this.transactionRecords.length;
      if (noOfRecords) {
        this.lastRowId = this.transactionRecords[noOfRecords - 1].id;
      }

      this.transactionRecords.push({
        id: (parseInt(this.lastRowId) + 1),
        name: data.name,
        amount: data.amount,
        description: data.description,
        type: data.type,
        date: data.date
      });
      localStorage.setItem('TRANSACTIONS', JSON.stringify(this.transactionRecords));
      resolve(true)
    });
  }

  deleteRecord(id: number) {
    return new Promise((resolve, reject) => {
      let transactionData: any = [];
      this.transactionRecords.map((m: any) => {
        if (m.id != id) {
          transactionData.push(m);
        }
      });

      this.transactionRecords = transactionData;
      localStorage.setItem('TRANSACTIONS', JSON.stringify(this.transactionRecords));
      resolve(true)
    });
  }
}
