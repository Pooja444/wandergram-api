import shortUUID from "short-uuid"
import { Comment } from "../model/comment"
import { Post } from "../model/post"
import { PostResponse } from "../model/response"
import { isEmpty } from "../util"

declare const WG_KV: KVNamespace

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': "GET, POST, DELETE, OPTIONS",
    'Access-Control-Allow-Headers': "Origin, Content-Type, Accept",
    'Content-Type': "application/json"
}

export const addComment = async (request: any) => {
    const id: string = request.params.id

    const response: PostResponse = {
        status: 400,
        message: "Something went wrong, please try again later!"
    }

    // If no post id is found for commenting, return 400
    if(id === undefined) {
        response.status = 400,
        response.message = "Post cannot be found for commenting, please try again later!"
        return new Response(JSON.stringify(response), { headers })
    }

    const postString: string | null = await WG_KV.get(id)

    if(postString !== null) {
        const post: Post = JSON.parse(postString)
        const comment: Comment = await request.json()
        
        if(post !== null && post.id !== undefined && comment !== null && !isEmpty(comment.content) && !isEmpty(comment.username)) {
            comment.id = shortUUID.generate()
            
            let comments: Comment[] = post.comments === undefined ? [] : post.comments
            comments.push(comment)
            post.comments = comments

            await WG_KV.put(post.id, JSON.stringify(post))

            response.status = 200
            response.message = "Comment added successfully to post!"
            response.response = comment
        }
    }

    return new Response(JSON.stringify(response), { headers })
}