import Head from 'next/head'
import NavBar from '../components/NavBar'
import { getAPIClient } from '../services/axios';
import Link from 'next/link'
import { parseCookies } from 'nookies';
import { PlusCircleIcon } from '@heroicons/react/solid'

export default function Users({ users }) {

  return (
    <div>
      <NavBar />
      <Head>
        <title>Users</title>
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 justify-start inline-block float-left flex">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <span className="pl-3 mt-2">
            <Link href="/user/new" >
              <a>
                <PlusCircleIcon className="h-6 w-6 text-gray-600" />
              </a>
            </Link>
          </span>
        </div>
      </header>
      <main>
        <div className="flex flex-col mt-12">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users?.map((user) => (
                      <tr key={user.email}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.firstName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`user/${user.id}`}
                          >
                            <a className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </a>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href='#'>
                            <a
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={async() => {
                                if (window.confirm('Are you sure you wish to delete this user?')) {
                                  const cookies = parseCookies()
                                  const apiClient = getAPIClient(cookies.token);
                                  await apiClient.delete(`/users/${user.id}`)
                                    .then(() => {
                                      window.location.reload()
                                    })
                                }
                              }}
                            >
                              Delete
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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

  const response = await apiClient.get('/users')

  return {
    props: {
      users: response.data
    }
  }
}