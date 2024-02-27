import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize, map } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-defer',
  templateUrl: 'home-defer.page.html',
  styleUrls: ['home-defer.page.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonAvatar, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent, DatePipe, RouterModule],
})
export class HomeDeferPage {
  private movieService = inject(MovieService);
  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public dummyArray = new Array(5);

  constructor() {
    this.loadMovies();
    // this.loadMovie("609681");
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;
    if (!event) {
      this.isLoading = true;
    }

    this.movieService
      .getTopRateMovies(this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
        catchError((err: any) => {
          console.error(err);
          this.error = err.error.status_message;
          return [];
        }),
        // map((res) => [] as const),
      )
      .subscribe({
        next: (res) => {
          // console.log(res);

          this.movies.push(...res.results);
          if (event) {
            event.target.disabled = res.total_pages === this.currentPage;
          }
        }
      });
  }

  loadMore(event: InfiniteScrollCustomEvent) { 
    this.currentPage++;
    this.loadMovies(event);
  }
}
