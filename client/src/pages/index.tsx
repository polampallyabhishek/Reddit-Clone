import Head from 'next/head'
import useSWR, { useSWRInfinite } from 'swr'
import { GetServerSideProps } from 'next'

import PostCard from '../components/PostCard'
import Sidebar from '../components/Sidebar'
import { useEffect, useState } from 'react'
import { Post } from '../types'

export default function Home() {
  const [observedPost, setObservedPost] = useState('')
  
  const { data, error, size: page, setSize: setPage, isValidating, revalidate } = useSWRInfinite<Post[]>(
    index => `/posts?page=${index}`
  );

  const posts: Post [] = data ? [].concat(...data) : [];
  const isInitialLoading = !data && !error;

  useEffect(() => {
    if(!posts || posts.length === 0) return

    const id = posts[posts.length - 1].identifier
    if(id !== observedPost) {
      setObservedPost(id)
      observeElement(document.getElementById(id))
    }
  }, [posts])

  const observeElement = (element: HTMLElement) => {
    if(!element) return
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting === true) {
        setPage(page + 1)
        observer.unobserve(element)
      }
    }, { threshold: 1 })
    observer.observe(element)
  }
  
  return (
    <div>
      <Head>
        <title>Reddit: Frontpage of the internet</title>
      </Head>
      <div className="container flex pt-4">
        <div className="w-full md:w-160">
          {isInitialLoading && <p className="text-lg text-center">No posts submitted yet</p>}
          {posts?.map(post => (
            <PostCard key={post.identifier} post={post} revalidate={revalidate}/>
          ))}
          {isValidating && posts.length > 0 && <p className="text-lg text-center">Fetching more posts</p>}
        </div>
        <div className="hidden lg:block">
        <Sidebar/>
        </div>
      </div>
    </div>
  )
}

// Server Side Rendering

// export const getServerSideProps: GetServerSideProps = async(context) => {
//   try {
//     const res = await axios.get('/posts')

//     return {
//       props: { posts: res.data }
//     }
//   } catch (error) {
//     return { props: { error: 'Something went wrong' }}
//   }
// }