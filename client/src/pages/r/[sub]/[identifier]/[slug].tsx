import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import classNames from 'classnames'
import { useRouter } from "next/router";
import useSWR from "swr";
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)

import SubInfo from "../../../../components/SubInfo";
import { useAuthState } from "../../../../context/auth";
import { FormEvent, useState } from "react";

const ActionButton = ({ children }) => {
    return <div className="px-1 py-1 mr-1 text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
}

export default function PostPage() {
    const [comment, setComment] = useState('')
    const router = useRouter()
    var { authenticated, user } = useAuthState()
    const { identifier, sub, slug } = router.query

    const { data: post, error, revalidate: newVote } = useSWR((identifier && slug) ? `/posts/${identifier}/${slug}` : null)
    const { data: comments, revalidate } = useSWR((identifier && slug) ? `/posts/${identifier}/${slug}/comments` : null)
    if(error) router.push('/')

    const vote = async (value: number, comment?: any) => {
        if(!authenticated) router.push('/login')

        if((!comment && value === post.userVote) || (comment && comment.userVote === value)) value = 0

        try {
          await axios.post('/misc/vote', {
            identifier,
            slug,
            commentIdentifier: comment?.identifier,
            value
          })
  
          revalidate()
          newVote()
        } catch (error) {
          console.log(error)
        }
    }

    const submitComment = async (event: FormEvent) => {
        event.preventDefault()
        if(comment.trim() === '') return

        try {
            await axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
                body: comment
            }).then(() => {
                setComment('')
                revalidate()
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Head>
                <title>{post?.title}</title>
            </Head>
            <Link href={`/r/${sub}`}>
                <a>
                    <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                        <div className="container flex">
                            {post && (
                                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                    <Image
                                        src={post.sub.imageUrl}
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            )}
                            <p className="text-xl font-semibold text-white">
                                /r/${sub}
                            </p>
                        </div>
                    </div>
                </a>
            </Link>
            <div className="container flex pt-5">
                <div className="w-160">
                    <div className="bg-white rounded">
                        {post && (
                            <>
                            <div className="flex">
                                <div className="flex-shrink-0 w-10 py-3 text-center rounded-l">
                                    <div onClick={() => vote(1)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
                                    <i className={classNames("icon-arrow-up", {
                                        'text-red-500': post.userVote === 1
                                    })}></i>
                                    </div>
                                    <p className="my-1 text-xs font-bold">{post.voteScore}</p>
                                    <div onClick={() => vote(-1)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600">
                                    <i className={classNames("icon-arrow-down", {
                                        'text-blue-600': post.userVote === -1
                                    })}></i>
                                    </div>
                                </div>
                                <div className="py-2 pr-2">
                                <div className="flex items-center">
                                    <img 
                                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y" 
                                        alt="avatar"
                                        className="w-6 h-6 mr-1 rounded-full cursor-pointer"/>
                                    <a className="text-xs font-bold cursor-pointer hover:underline">/r/{post.subName}</a>                  
                                    <p className="text-xs text-gray-500">
                                    <span className="mx-1">•</span> 
                                    Posted by
                                    <Link href={`/u/${post.username}`}>
                                        <a className="mx-1 hover:underline">
                                        {`/u/${post.username}`}
                                        </a>
                                    </Link>
                                    <Link href={post.url}>
                                        <a className="mx-1 hover:underline">
                                        {dayjs(post.createdAt).fromNow()}
                                        </a>
                                    </Link>
                                    </p>
                                    </div>
                                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                                    <p className="my-3 text-sm">{post.body}</p>
                                    <div className="flex">
                                    <Link href={post.url}>
                                        <a>
                                        <ActionButton>
                                            <i className="fas fa-comment-alt fa-xs">
                                            <span className="ml-1 text-xs font-bold">{post.commentCount} Comments</span>
                                            </i>
                                        </ActionButton>
                                        </a>
                                    </Link>
                                    <ActionButton>
                                        <i className="fas fa-share fa-xs">
                                        <span className="ml-1 text-xs font-bold">Share</span>
                                        </i>
                                    </ActionButton>
                                    <ActionButton>
                                        <i className="fas fa-bookmark fa-xs">
                                        <span className="ml-1 text-xs font-bold">Save</span>
                                        </i>
                                    </ActionButton>
                                    </div>
                                </div>
                            </div>
                            <div className="pl-10 pr-6 mb-4">
                                {authenticated ? (
                                    <div>
                                        <p className="mb-1 text-xs">
                                            Comment as
                                            <Link href={`/u/${user.username}`}>
                                                <a className="font-semibold text-blue-500">{user.username}</a>
                                            </Link>
                                        </p>
                                        <form onSubmit={submitComment}>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 focus:outline-none focus:border-gray-600"
                                                onChange={e => setComment(e.target.value)}
                                                value={comment}
                                            ></textarea>
                                            <div className="flex justify-end">
                                                <button className="px-3 py-1 blue button">Comment</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                                        <p className="font-semibold text-gray-400">Log in or sign up to leave a comment</p>
                                        <div>
                                            <Link href="/login">
                                                <a className="px-4 py-1 mr-4 hollow blue button">Login</a>
                                            </Link>
                                            <Link href="/register">
                                                <a className="px-4 py-1 blue button">Sign up</a>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <hr/>
                            {comments?.map(comment => (
                                <div className="flex" key={comment.identifier}>
                                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                        <div onClick={() => vote(1, comment)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
                                        <i className={classNames("icon-arrow-up", {
                                            'text-red-500': comment.userVote === 1
                                        })}></i>
                                        </div>
                                        <p className="my-1 text-xs font-bold">{comment.voteScore}</p>
                                        <div onClick={() => vote(-1, comment)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600">
                                        <i className={classNames("icon-arrow-down", {
                                            'text-blue-600': comment.userVote === -1
                                        })}></i>
                                        </div>
                                    </div>
                                    <div className="py-2 pr-2">
                                        <p className="mb-1 text-xs leading-none">
                                            <Link href={`/u/${comment.username}`}>
                                                <a className="mr-1 font-bold hover:underline">{comment.username}</a>
                                            </Link>
                                            <span className="text-gray-600">
                                                {`${comment.voteScore} points • ${dayjs(comment.createdAt).fromNow()}`}
                                            </span>
                                        </p>
                                        <p>{comment.body}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                        )}
                    </div>
                </div>
                {post && <SubInfo sub={post.sub}/>}
            </div>
        </>
    )
}
