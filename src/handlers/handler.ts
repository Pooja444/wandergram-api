import { Router } from 'itty-router';
import { addComment } from './commentHandler';
import { getAllPosts, getOnePost, sendPost } from './postHandler';
import { votePost } from './voteHandler';

const router = Router()

router
  .get('/posts', getAllPosts)   // Lists all posts
  .get('/post/:id', getOnePost)   // Gets post by id
  .post('/posts', sendPost)   // Creates a new post or updates an existing one
  .post('/post/:id/comment', addComment)    // Adds a comment on an existing post
  .post('/post/:id/vote', votePost)   // Upvotes or Downvotes a post
  .get('*', () => new Response("Not found", { status: 404 }))
  .post('*', () => new Response("Not found", { status: 404 }));

export const handleRequest = (request: Request) => router.handle(request)