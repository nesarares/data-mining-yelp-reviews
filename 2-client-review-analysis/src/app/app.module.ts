import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import {
  NbCardModule,
  NbLayoutModule,
  NbSpinnerModule,
  NbThemeModule,
  NbInputModule,
  NbButtonModule
} from "@nebular/theme";
import { RatingModule } from "ng-starrating";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RestaurantsComponent } from "./restaurants/restaurants.component";
import { ReviewComponent } from "./review/review.component";

@NgModule({
  declarations: [AppComponent, RestaurantsComponent, ReviewComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbLayoutModule,
    NbEvaIconsModule,
    AppRoutingModule,
    NbCardModule,
    FormsModule,
    HttpClientModule,
    NbSpinnerModule,
    RatingModule,
    NbInputModule,
    NbButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
