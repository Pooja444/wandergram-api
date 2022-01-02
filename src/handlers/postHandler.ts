import shortUUID from "short-uuid"
import { Post } from "../model/post"
import { PostResponse } from "../model/response"
import { isEmpty } from "../util"

declare const WG_KV: KVNamespace

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': "GET, POST, DELETE, OPTIONS",
    'Access-Control-Allow-Headers': "Origin, Content-Type, Accept"
}

export const getAllPosts = async () => {
    const listResult: KVNamespaceListResult<{name: string}> = await WG_KV.list()
    let posts: Post[] = []

    for(const key of listResult.keys) {
        const postString: string | null = await WG_KV.get(key.name)
        if(postString !== null) posts.push(JSON.parse(postString))
    }
    
    return new Response(JSON.stringify(posts), { headers })
}

// change this union thing
export const getOnePost = async (request: any) => {
    let postResponse: PostResponse | Post = {
        status: 404,
        message: "No post found with the given id"
    }
    if(request.params.id !== null) {
        const postString = await WG_KV.get(request.params.id)
        if(postString !== null) {
            postResponse = <Post>JSON.parse(postString)
        }
    }
    return new Response(JSON.stringify(postResponse), { headers })
}

export const sendPost = async (request: any) => {
    const post: Post = await request.json()
    if(post.id !== undefined) {
        return await updatePost(post)
    } else {
        return await newPost(post, shortUUID.generate())
    }
}

async function updatePost(post: Post) {
    let postResponse: PostResponse = {
        status: 400,
        message: "Something went wrong, please try again!"
    }

    let oldPostString: string | null = null

    if(post.id !== undefined) oldPostString = await WG_KV.get(post.id)

    if(oldPostString !== null && !isEmpty(post.title) && !isEmpty(post.content) && !isEmpty(post.username)) {
        const oldPost: Post = JSON.parse(oldPostString)

        if(oldPost !== null && oldPost.id !== undefined) {

            // Only title and content can be updated for now. Support for images to be added later
            oldPost.title = post.title
            oldPost.content = post.content

            await WG_KV.put(oldPost.id, JSON.stringify(oldPost))

            postResponse.status = 200
            postResponse.message = "Post updated successfully!"
            
            return new Response(JSON.stringify(postResponse), { headers })
        }
    }
}

async function newPost(post: Post, id: string) {
    post.id = id
    let postResponse: PostResponse = {
        status: 200,
        message: "Post successful"
    }
    if(!isEmpty(post.title) && !isEmpty(post.content) && !isEmpty(post.username)) {
        await WG_KV.put(id, JSON.stringify(post))
    } else {
        postResponse.status = 400
        postResponse.message = "Some required fields are missing!"
    }
    return new Response(JSON.stringify(postResponse), { headers })
}

