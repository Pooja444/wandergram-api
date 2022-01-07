import { Post } from "../model/post"
import { PostResponse } from "../model/response"
import { Vote } from "../model/vote"
import { isEmpty } from "../util"

declare const WG_KV: KVNamespace

const headers = {
    'Access-Control-Allow-Origin': "https://wandergram.pages.dev",
    'Access-Control-Allow-Methods': "GET, POST, DELETE, OPTIONS, PUT",
    'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept"
}

export const votePost = async (request: any) => {
    const id = request.params.id
    const response: PostResponse = {
        status: 400,
        message: "Something went wrong, please try again later!"
    }

    // If no post id is found for voting, return 400
    if (id === undefined) {
        response.status = 400,
            response.message = "Post cannot be found for voting, please try again later!"
        return new Response(JSON.stringify(response), { headers: headers })
    }

    const postString: string | null = await WG_KV.get(id)

    if (postString !== null) {
        const post: Post = JSON.parse(postString)
        const vote: Vote = await request.json()

        if (post !== null && post !== undefined && post.id !== undefined && !isEmpty(post.id)
            && vote !== null && vote !== undefined && !isEmpty(vote.username)
            && vote.type !== null && vote.type !== undefined && (vote.type == "upvote" || vote.type == "downvote")) {

            post.votes = post.votes === undefined ? [] : post.votes
            let userVote: Vote[] = post.votes.filter(postVote => postVote.username === vote.username)

            // If this user has already voted, perform an action based on vote type
            // Else, simply add the vote
            if (userVote.length !== 0) {
                // This user has already upVoted and is upVoting again OR already downVoted and downVoting again
                // In this case, simply remove the corresponding vote (upVote/downVote)
                // Else, update the vote type for that user
                // First we remove the user altogether. If vote is different, add back the user with updated vote
                post.votes = post.votes.filter(postVote => postVote.username !== vote.username)
                if (userVote[0].type !== vote.type) {
                    post.votes.push({
                        username: vote.username,
                        type: vote.type
                    })
                }
            } else {
                post.votes.push({
                    username: vote.username,
                    type: vote.type
                })
            }

            await WG_KV.put(post.id, JSON.stringify(post))

            response.status = 200
            response.message = "Vote successful"
            response.response = post
        }
    }

    return new Response(JSON.stringify(response), { headers: headers })
}