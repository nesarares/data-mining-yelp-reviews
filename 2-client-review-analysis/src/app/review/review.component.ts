import { Component, OnInit, Input } from '@angular/core';

export interface Review {
  _id: string;
  business_id: string;
  stars: number;
  useful: number;
  funny: number;
  cool: number;
  text: string;
  date: string;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() review: Review
  showMore = false;

  constructor() { }

  ngOnInit() {
  }

}
