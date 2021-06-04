import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { useAuthState } from '../context/auth'

const Sidebar = () => {
    const { data: topSubs } = useSWR('/misc/top-subs')

    const { authenticated } = useAuthState()
    return (
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communites
              </p>
            </div>
              {topSubs?.map(sub => (
                <div key={sub.name} className="flex items-center px-4 py-2 text-xs border-b">
                  <div className="mr-2 overflow-hidden rounded-full">
                    <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        className="rounded-full cursor-pointer"
                        width={6 * 16/4}
                        height={6 * 16/4}
                      />
                    </a>
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold cursor-pointer">/r/${sub.name}</a>
                  </Link>
                  <p className="ml-auto font-medium">{sub.postCount}</p>
                </div>
              ))}
              {authenticated && (
                <div className="p-4 border-t-2">
                  <Link href="/subs/create">
                    <a className="w-full px-2 py-1 blue button">Create Community</a>
                  </Link>
                </div>
              )}
          </div>          
        </div>
    )
}

export default Sidebar