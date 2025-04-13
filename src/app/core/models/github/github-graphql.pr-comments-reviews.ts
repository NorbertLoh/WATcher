import { flattenEdges } from '../../../shared/lib/graphgql-common';
import { GithubIssue } from './github-issue.model';

export class GithubGraphqlPullRequestWithReviewsAndComments extends GithubIssue {
  constructor(pr: any) {
    // Replace 'any' with a more specific type if possible
    super({
      issueOrPr: 'PullRequest', // Set the issueOrPr type
      id: pr.id,
      number: pr.number,
      body: pr.body,
      created_at: String(pr.createdAt),
      updated_at: String(pr.updatedAt),
      url: String(pr.url),
      title: pr.title,
      state: pr.state,
      stateReason: pr.stateReason, // Add stateReason
      user: {
        login: pr.author.login
      },
      assignees: flattenEdges(pr.assignees.edges),
      labels: flattenEdges(pr.labels.edges),
      milestone: pr.milestone ? pr.milestone : null,
      isDraft: pr.isDraft
    });
    this.reviews =
      pr.reviews?.edges.map((reviewEdge: any) => ({
        id: reviewEdge.node.id,
        author: {
          login: reviewEdge.node.author.login
        },
        createdAt: reviewEdge.node.createdAt,
        state: reviewEdge.node.state,
        comments:
          reviewEdge.node.comments?.edges.map((commentEdge: any) => ({
            id: commentEdge.node.id,
            author: {
              login: commentEdge.node.author.login
            },
            createdAt: commentEdge.node.createdAt,
            bodyText: commentEdge.node.bodyText
          })) || []
      })) || [];
    this.comments =
      pr.comments?.edges.map((edge: any) => ({
        id: edge.node.id,
        author: {
          login: edge.node.author.login
        },
        createdAt: edge.node.createdAt,
        bodyText: edge.node.bodyText
      })) || [];
  }
  reviews: any[];
  comments: any[];
}
