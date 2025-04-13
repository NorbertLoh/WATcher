import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, throwError, timer } from 'rxjs';
import { catchError, exhaustMap, finalize, map } from 'rxjs/operators';
import { GithubGraphqlPullRequestWithReviewsAndComments } from '../models/github/github-graphql.pr-comments-reviews';
import { GithubService } from './github.service';

@Injectable({
  providedIn: 'root'
})
export class PullRequestWithCommentsAndReviewsService {
  static readonly POLL_INTERVAL = 20000; // 20 seconds
  pullRequests: { [id: number]: GithubGraphqlPullRequestWithReviewsAndComments } = {};
  pullRequests$ = new BehaviorSubject<GithubGraphqlPullRequestWithReviewsAndComments[]>([]);
  private prPollSubscription: Subscription;
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(private githubService: GithubService) {}

  startPollPullRequests(owner: string, repo: string) {
    if (this.prPollSubscription === undefined) {
      if (this.pullRequests$.getValue().length === 0) {
        this.isLoading.next(true);
      }
      this.prPollSubscription = timer(0, PullRequestWithCommentsAndReviewsService.POLL_INTERVAL)
        .pipe(
          exhaustMap(() => {
            return this.githubService.fetchPullRequestData().pipe(
              catchError((err) => throwError(err)),
              finalize(() => this.isLoading.next(false))
            );
          })
        )
        .subscribe((pullRequests: GithubGraphqlPullRequestWithReviewsAndComments[]) => {
          this.updateLocalStore(pullRequests);
        });
    }
  }

  stopPollPullRequests() {
    if (this.prPollSubscription) {
      this.prPollSubscription.unsubscribe();
      this.prPollSubscription = undefined;
    }
  }

  reloadAllPullRequests(): Observable<GithubGraphqlPullRequestWithReviewsAndComments[]> {
    return this.initializeData();
  }

  getPullRequest(id: number): Observable<GithubGraphqlPullRequestWithReviewsAndComments> {
    if (this.pullRequests[id]) {
      return of(this.pullRequests[id]);
    } else {
      return this.getLatestPullRequest(id);
    }
  }

  getLatestPullRequest(id: number): Observable<GithubGraphqlPullRequestWithReviewsAndComments> {
    return this.githubService.fetchPullRequestData().pipe(
      map((prs: GithubGraphqlPullRequestWithReviewsAndComments[]) => {
        const thePr = prs.find((pr) => pr.number === id);
        if (thePr) {
          this.updateLocalStore([thePr]);
        }
        return thePr;
      }),
      catchError((err) => {
        return of(this.pullRequests[id]);
      })
    );
  }

  private updateLocalStore(pullRequests: GithubGraphqlPullRequestWithReviewsAndComments[]) {
    const newPullRequests = { ...this.pullRequests };
    pullRequests.forEach((pr) => {
      newPullRequests[pr.id] = pr; // Use pr.id as the key
    });
    this.pullRequests = newPullRequests;
    this.pullRequests$.next(Object.values(this.pullRequests));
  }

  reset() {
    this.pullRequests = {};
    this.pullRequests$.next([]);
    this.stopPollPullRequests();
  }

  private initializeData(): Observable<GithubGraphqlPullRequestWithReviewsAndComments[]> {
    return this.githubService.fetchPullRequestData().pipe(
      map((pullRequests: GithubGraphqlPullRequestWithReviewsAndComments[]) => {
        this.updateLocalStore(pullRequests);
        return Object.values(this.pullRequests);
      })
    );
  }
}
