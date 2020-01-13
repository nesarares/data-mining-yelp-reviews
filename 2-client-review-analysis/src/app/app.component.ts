import { Component, AfterViewInit, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Review } from "./review/review.component";

declare let anychart: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "review-analysis";

  selectedStars;
  businessId;
  prediction;
  reviewText;

  isLoading = false;
  isLoadingPrediction = false;
  hasData = false;
  interestingReviews: Review[];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  async fetchData() {
    if (!this.businessId || !this.selectedStars) return;

    try {
      this.isLoading = true;
      this.clearContainers();
      await this.drawBagOfWords();
      await this.drawMostCommonNgrams();
      await this.getInterestingReviews();
      this.hasData = true;
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

  clearContainers() {
    document.querySelector("div#container").innerHTML = "";
    document.querySelector("div#containerNgrams").innerHTML = "";
  }

  async drawBagOfWords(
    businessId: string = this.businessId,
    stars: number = this.selectedStars
  ) {
    const resp = await this.http
      .get<[string, number][]>(
        `${environment.baseUrl}/bagofwords?business_id=${businessId}&stars=${stars}`
      )
      .toPromise();

    const data = resp.map(arr => ({ x: arr[0], value: arr[1] }));

    let chart = anychart.tagCloud(data);
    chart.container("container");
    chart.draw();
  }

  async drawMostCommonNgrams(
    businessId: string = this.businessId,
    stars: number = this.selectedStars
  ) {
    const resp = await this.http
      .get<[string[], number][]>(
        `${environment.baseUrl}/ngrams?business_id=${businessId}&stars=${stars}`
      )
      .toPromise();

    const data = resp.map(arr => ({ x: arr[0].join(" "), value: arr[1] }));

    let chart = anychart.tagCloud(data);
    chart.container("containerNgrams");
    chart.draw();
  }

  async getInterestingReviews(
    businessId: string = this.businessId,
    stars: number = this.selectedStars
  ) {
    const resp = await this.http
      .get<Review[]>(
        `${environment.baseUrl}/reviews?business_id=${businessId}&stars=${stars}`
      )
      .toPromise();

    this.interestingReviews = resp;
  }

  async onRestaurantClick(businessId) {
    this.businessId = businessId;
    await this.fetchData();
  }

  async onSelectStars(event) {
    this.selectedStars = event.newValue;
    await this.fetchData();
  }

  async predict() {
    try {
      this.prediction = null;
      this.isLoadingPrediction = true;
      const resp = await this.http
        .post<{ stars: number }>(
          `${environment.baseUrl}/predict?business_id=${this.businessId}`,
          { text: this.reviewText }
        )
        .toPromise();
      this.prediction = resp.stars;
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoadingPrediction = false;
    }
  }
}
