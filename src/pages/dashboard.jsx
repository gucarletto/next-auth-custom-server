import Head from 'next/head'
import { parseCookies } from 'nookies';
import NavBar from '../components/NavBar'
import { getAPIClient } from '../services/axios';

export default function Dashboard() {

  return (
    <div>
      <NavBar />
      <Head>
        <title>Home Page</title>
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Home Page</h1>
        </div>
      </header>
      <main>
      </main>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const { ['nextauth.token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}