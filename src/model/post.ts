import { Comment } from './comment'

export interface Post {
    id?: string
    title: string
    username: string
    content: string
    images?: string[]
    upvotes?: number
    downvotes?: number
    reaction?: string
    comments?: Comment[]
}