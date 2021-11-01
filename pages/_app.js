import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="p-6 text-right bg-pink-800 text-gray-900">
        <p className="text-3xl md:text-5xl font-bold">Reductio Ad Absurdum</p>
        <div className="flex flex-col md:flex-row mt-4 justify-end">
          <Link href="/">
            <a className="text-l md:text-xl  text-gray-200 hover:text-gray-400 py-1">
              home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="text-l md:text-xl md:ml-6 text-gray-200 hover:text-gray-400 py-1">
              create-item
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="text-l md:text-xl md:ml-6 text-gray-200 hover:text-gray-400 py-1">
              my-assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="text-l md:text-xl md:ml-6 text-gray-200 hover:text-gray-400 py-1">
              creator-dashboard
            </a>
          </Link>
        </div>
      </nav>
      <div className="py-6"></div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp