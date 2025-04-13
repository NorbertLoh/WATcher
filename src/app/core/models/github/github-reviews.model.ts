import * as moment from 'moment';
import { GithubComment } from './github-comment.model';

export class GithubReview {
  id: string;
  author: {
    login: string;
  };
  createdAt: string;
  state: string;
  comments: GithubComment[];

  constructor(review: GithubReview) {
    this.id = review.id;
    this.author = { login: review.author.login };
    this.createdAt = moment(review.createdAt).format('lll');
    this.state = review.state;
    this.comments =
      review.comments?.map(
        (c: any) =>
          new GithubComment({
            // Use GithubComment constructor
            body: c.body,
            created_at: c.createdAt,
            id: c.id,
            issue_url: c.issue_url,
            updated_at: c.updated_at,
            url: c.url,
            user: c.author
          })
      ) || [];
  }
}
