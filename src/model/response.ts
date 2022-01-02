import { Comment } from "./comment";
import { Post } from "./post";

export interface PostResponse {
    status: number
    message: string
    response?: Post | Comment
}