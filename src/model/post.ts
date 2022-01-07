import { Comment } from './comment'
import { Vote } from './vote';

export interface Post {
    id?: string
    title: string
    username: string
    content: string
    images?: string[]
    votes? : Vote[]
    reaction?: string
    comments?: Comment[]
    datetime: Date
}