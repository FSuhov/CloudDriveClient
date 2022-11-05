import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.css']
})
export class FileCardComponent implements OnInit {
  @Input() file: File;

  constructor() { }

  ngOnInit(): void {
  }

}
