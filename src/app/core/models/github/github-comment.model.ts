export class GithubComment {
  body: string;
  created_at: string;
  id: number;
  issue_url: string;
  updated_at: string;
  url: string; // api url
  user: {
    login: string;
    id: number;
    avatar_url: string;
    url: string;
  };

  constructor(comment: GithubComment) {
    this.body = comment.body;
    this.created_at = comment.created_at;
    this.id = comment.id;
    this.issue_url = comment.issue_url;
    this.updated_at = comment.updated_at;
    this.url = comment.url;
    this.user = comment.user;
  }
}
