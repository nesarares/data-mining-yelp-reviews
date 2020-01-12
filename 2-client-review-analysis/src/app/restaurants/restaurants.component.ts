import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  city: string;
  stars: string;
  review_count: string;
}

@Component({
  selector: "app-restaurants",
  templateUrl: "./restaurants.component.html",
  styleUrls: ["./restaurants.component.scss"]
})
export class RestaurantsComponent implements OnInit {
  @Output() restaurantClick: EventEmitter<string> = new EventEmitter();
  
  restaurants: Restaurant[];
  selectedId;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRestaurants().then();
  }

  async getRestaurants() {
    const resp = await this.http
      .get<Restaurant[]>(`${environment.baseUrl}/business`)
      .toPromise();
    console.log(resp);
    this.restaurants = resp;
  }
}
