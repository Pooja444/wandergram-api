import { Post } from "./post";

export interface PostResponse {
    status: number
    message: string
    post?: Post
}