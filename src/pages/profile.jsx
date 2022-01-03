import Head from 'next/head'
import { parseCookies } from "nookies";
import NavBar from "../components/NavBar";
import { getAPIClient } from "../services/axios";
import { useForm } from 'react-hook-form'
import { useContext, useEffect } from "react";
import { AuthContext } from '../contexts/AuthContext'
import Router from 'next/router'

export default function Profile() {

  const { register, handleSubmit, setValue } = useForm();
  const { user, setUser } = useContext(AuthContext)

  useEffect(() => {
    setValue('email', user?.email)
    setValue('firstName', user?.firstName)
    setValue('lastName', user?.lastName)
  }, [user])

  async function handleUpdate(data) {
    try {
      const cookies = parseCookies();
      const client = getAPIClient(cookies.token);
      await client.put('/users/profile/update', data);
      setUser({ user, ...data })
      alert('Profile updated successfully')
      Router.push('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <NavBar />
      <Head>
        <title>Profile</title>
      </Head>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-6 md:gap-6">
          <div className="mt-5 md:mt-0 md:col-span-6">
            <form action="#" method="POST" onSubmit={handleSubmit(handleUpdate)}>
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-4 sm:col-span-3">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        {...register('firstName')}
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        autoComplete="given-name"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-3">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        {...register('lastName')}
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        autoComplete="family-name"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        name="email"
                        id="email"
                        required
                        autoComplete="email"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
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