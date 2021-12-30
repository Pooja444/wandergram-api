import { Router } from 'itty-router'
import { addComment } from './commentHandler'
import { getAllPosts, getOnePost, sendPost } from './postHandler'
import { downVoteComment, downVotePost, upVoteComment, upVotePost } from './voteHandler'

const router = Router()

router
  .get('/posts', getAllPosts)   // Lists all posts
  .get('/post/:id', getOnePost)   // Gets post by id
  .post('/posts', sendPost)   // Creates a new post or updates an existing one
  .post('/post/:id/comment', addComment)    // Adds a comment on an existing post
  .post('/post/:id/upvote', upVotePost)   // Upvotes a post
  .post('/post/:id/downvote', downVotePost)   // Downvotes a post
  .post('/post/:id/comment/:commentid/upvote', upVoteComment)   // Upvotes a comment on a post
  .post('/post/:id/comment/:commentid/downvote', downVoteComment)   // Downvotes a comment a post
  .get('*', () => new Response("Not found", { status: 404 }))
  .post('*', () => new Response("Not found", { status: 404 }))

export const handleRequest = (request: Request) => router.handle(request)