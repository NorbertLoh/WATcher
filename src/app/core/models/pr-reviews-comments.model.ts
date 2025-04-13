import * as moment from 'moment';
import { GithubPullRequest } from './github/github-pr-comments-reviews.model';
import { GithubComment } from './github/github-comment.model';
import { GithubReview } from './github/github-reviews.model';

export class PullRequestWithReviewsAndComment {
  readonly globalId: string;
  readonly id: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly title: string;
  readonly description: string;
  readonly author: string;
  readonly state: string;
  readonly isDraft: boolean;

  readonly reviews: Array<GithubReview>;
  readonly comments: Array<GithubComment>;

  /**
   * Constructor for PullRequest.
   * @param prData - Data object containing pull request information.
   */
  constructor(prData: GithubPullRequest) {
    this.globalId = prData.id;
    this.id = prData.number;
    this.created_at = moment(prData.created_at).format('lll');
    this.updated_at = moment(prData.updated_at).format('lll');
    this.title = prData.title;
    this.description = prData.body || ''; // Provide a default if body is null/undefined
    this.author = prData.user.login;
    this.state = prData.state;
    this.isDraft = prData.isDraft;

    this.reviews = prData.reviews || [];
    this.comments = prData.comments || [];
  }

  /**
   * Creates a PullRequest instance from a GithubGraphqlPullRequest.
   * @param githubPullRequest - The GithubGraphqlPullRequest object.
   * @returns A new PullRequest instance.
   */
  static createFromGithubGraphql(githubPullRequest: GithubPullRequest): PullRequestWithReviewsAndComment {
    return new PullRequestWithReviewsAndComment(githubPullRequest);
  }
}
