export interface Post {
    identifier: string,
    title: string,
    slug: string,
    subName: string,
    username: string,
    body?: string,
    createdAt: string,
    updatedAt: string,
    url: string,
    voteScore?: number
    commentCount?: number
    userVote?: number
    sub: any
}

export interface User {
    username: string,
    email: string,
    createdAt: string,
    updatedAt: string
}