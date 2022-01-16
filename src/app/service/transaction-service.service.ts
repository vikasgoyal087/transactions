import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionServiceService {
  db: any;
  noOfRecord: number = 0;
  lastRowId: any = 0;
  transactionRecords: any = [];
  totalSavings: number = 0;
  totalIncome: number = 0;
  totalExpense: number = 0;

  constructor() {
    if("openDatabase" in window){
      this.db = (<any>window).openDatabase('transactiondb', '1.0', 'Transactions DB', 2 * 1024 * 1024);
      this.createTable();
      this.fetchLastRecord();
      this.fetchTotalSaving();
    }
  }

  createTable() {
    this.db.transaction((tx: any) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS TRANSACTIONS (id unique, name, amount, description, type, date)');
    });
  }

  fetchTotalSaving() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        tx.executeSql('SELECT SUM(amount) as total, type FROM TRANSACTIONS GROUP BY type order by type', [], (tx: any, results: any) => {
          for (var i = 0; i < results.rows.length; i++) {
            if (results.rows.item(i).type == "Income") {
              this.totalIncome = results.rows.item(i).total;
            } else if (results.rows.item(i).type == 'Expense') {
              this.totalExpense = results.rows.item(i).total
            }
          }

          this.totalSavings = this.totalIncome - this.totalExpense;
          resolve(this.totalSavings);
        });
      });
    });
  }

  fetchLastRecord() {
    this.db.transaction((tx: any) => {
      tx.executeSql('SELECT id FROM TRANSACTIONS ORDER BY id desc', [], (tx: any, results: any) => {
        if (results.rows.length) {
          this.lastRowId = results.rows.item(0).id;
        }
      }, null);
    });
  }

  fetchRecords() {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        tx.executeSql('SELECT * FROM TRANSACTIONS', [], (tx: any, results: any) => {
          this.noOfRecord = results.rows.length;
          for (var i = 0; i < this.noOfRecord; i++) {
            this.transactionRecords.push(results.rows.item(i));
          }
          //resolve(this.transactionRecords);
          resolve(results.rows);
        }, null);
      });
    });
  }

  addRecord(data: any) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        tx.executeSql('INSERT INTO TRANSACTIONS (id, name, amount, description, type, date) VALUES ("' + (parseInt(this.lastRowId) + 1) + '", "' + data.name + '", "' + data.amount + '", "' + data.description + '", "' + data.type + '", "' + data.date + '")', [], (tx: any, results: any) => {
          this.fetchLastRecord();
          resolve(true);
        }, (tx: any, error: any) => {
          console.log(error.message);
          reject(false);
        });
      });
    });
  }

  deleteRecord(id: number) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        tx.executeSql('DELETE FROM TRANSACTIONS WHERE id= "' + id + '"', [], (tx: any, results: any) => { resolve(true) }, (tx: any, error: any) => {
          console.log(error.message);
          reject(false);
        });;
      });
    });
  }
}
