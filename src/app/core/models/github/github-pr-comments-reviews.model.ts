import * as moment from 'moment';
import { GithubComment } from './github-comment.model';
import { GithubLabel } from './github-label.model';
import { GithubReview } from './github-reviews.model';

export class GithubPullRequest {
  id: string; // Github's backend's id
  number: number; // PR's display id
  assignees: Array<{
    login: string;
  }>;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  url: string;
  title: string;
  user: {
    // author
    login: string;
  };
  milestone?: {
    number: string; // id for milestone
    title: string;
    state: string;
  };
  labels: Array<GithubLabel>;
  state: string;
  isDraft: boolean;
  reviews: Array<GithubReview>;
  comments: Array<GithubComment>;

  constructor(pr: any) {
    this.id = pr.id;
    this.number = pr.number;
    this.assignees = pr.assignees?.map((a: any) => ({ login: a.login })) || [];
    this.body = pr.body;
    this.created_at = moment(pr.createdAt).format('lll');
    this.updated_at = moment(pr.updatedAt).format('lll');
    this.closed_at = pr.closedAt ? moment(pr.closedAt).format('lll') : '';
    this.url = pr.url;
    this.title = pr.title;
    this.user = pr.author;
    this.milestone = pr.milestone;
    this.labels = pr.labels?.map((label: any) => new GithubLabel(label)) || [];
    this.state = pr.state;
    this.isDraft = pr.isDraft;
    this.reviews = pr.reviews?.map((review: any) => new GithubReview(review)) || [];
    this.comments = pr.comments?.map((comment: any) => new GithubComment(comment)) || [];
  }
}
