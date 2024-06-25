import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-election-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './election-result.component.html',
  styleUrls: ['./election-result.component.css'],
})
export class ElectionResultComponent {
  number = '99999';
  previousNumber = '';

  addNumber() {
    this.previousNumber = this.number;

    let numArray = this.number.split('');
    let i = numArray.length - 1;
    while (i >= 0 && numArray[i] === '9') {
      numArray[i] = '0';
      i--;
    }

    if (i >= 0) {
      numArray[i] = (parseInt(numArray[i]) + 1).toString();
    } else {
      numArray.unshift('1');
    }

    this.number = numArray.join('');
  }
}
