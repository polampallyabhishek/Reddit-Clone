import React from 'react'
import Link from 'next/link'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import axios from 'axios'
import classNames from 'classnames'
dayjs.extend(relativeTime)

import { Post } from '../types'
import { useAuthState } from '../context/auth'
import { useRouter } from 'next/router'

interface PostCardProps {
  post: Post
  revalidate?: Function
}

const ActionButton = ({ children }) => {
  return <div className="px-1 py-1 mr-1 text-gray-400 rounded cursor-pointer hover:bg-gray-200">
    {children}
  </div>
}

export default function PostCard({ post: { identifier, voteScore, subName, title, body, createdAt, slug, userVote, commentCount, url, username, sub}, revalidate }: PostCardProps) {
  const { authenticated } = useAuthState()

  const router = useRouter()

  const isInSubPage = router.pathname === '/r/[sub]'
  const vote = async (value) => {
    if(!authenticated) router.push('/login')
      
    if(value === userVote) value = 0

    try {
      const res = await axios.post('/misc/vote', {
        identifier,
        slug,
        value
      })

      if(revalidate) revalidate()

      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
          <div key={identifier} className="flex mb-4 bg-white rounded" id={identifier}>
            {/* Vote section */}
            <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
              <div onClick={() => vote(1)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
                <i className={classNames("icon-arrow-up", {
                  'text-red-500': userVote === 1
                })}></i>
              </div>
              <p className="my-1 text-xs font-bold">{voteScore}</p>
              <div onClick={() => vote(-1)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600">
                <i className={classNames("icon-arrow-down", {
                  'text-blue-600': userVote === -1
                })}></i>
              </div>
            </div>
            {/* Post data section */}
            <div className="w-full p-2">
              <div className="flex items-center">
                <Link href={`/r/${subName}`}>
                  <img 
                    src={sub.imageUrl} 
                    alt="avatar"
                    className="w-6 h-6 mr-1 rounded-full cursor-pointer"/>                     
                </Link>
                <Link href={`/r/${subName}`}>
                  <a className="text-xs font-bold cursor-pointer hover:underline">/r/{subName}</a>
                </Link>                  
                <p className="text-xs text-gray-500">
                <span className="mx-1">•</span> 
                Posted by
                <Link href={`/u/${username}`}>
                  <a className="mx-1 hover:underline">
                    {`/u/${username}`}
                  </a>
                </Link>
                <Link href={url}>
                  <a className="mx-1 hover:underline">
                    {dayjs(createdAt).fromNow()}
                  </a>
                </Link>
                </p>
              </div>
              <Link href={url}>
                <a className="my-1 text-lg font-medium">{title}</a>
              </Link>
              {body && <p className="my-1 text-sm">{body}</p>}
              <div className="flex">
                <Link href={url}>
                  <a>
                    <ActionButton>
                      <i className="fas fa-comment-alt fa-xs">
                        <span className="ml-1 text-xs font-bold">{commentCount} Comments</span>
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
    )
}
