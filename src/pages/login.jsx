import Head from 'next/head'
import Link from 'next/link'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useForm } from 'react-hook-form'
import { useContext,  useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { signInCheckRequest, getTotpTokenRequest, validateTotpTokenRequest } from "../services/auth";
import { parseCookies } from 'nookies';
import { verify } from 'jsonwebtoken';
import variables from '../styles/variables.module.scss'
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

export default function Home() {

  const { register, handleSubmit, setValue } = useForm();
  const { signIn } = useContext(AuthContext)

  const [loginChecked, setLoginChecked] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  async function handleSignIn(data) {
    setError(null)
    setMessage(null)
    if(!loginChecked) {
      let valid = false;
      try {
        const respondeData = await signInCheckRequest(data)
        valid = respondeData.valid;
      } catch (error) {
        setError('Invalid email or password')
      }
      if(valid) {
        const { code } = await getTotpTokenRequest()
        setMessage('Check your Two Factor Authentication code on console')
        console.log(`Yout Two Factor Authentication Code is ${code}`);
        setLoginChecked(true);
      }
    } else {
      let valid = false;
      try {
        const respondeData = await validateTotpTokenRequest(data)
        valid = respondeData.valid;
      } catch (error) {
        setError('Error validating code');
      }
      if(valid) {
        await signIn(data);
      } else {
        setValue('confirmationCode', null)
        setLoginChecked(false);
        setError('Invalid Confirmation Code')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: variables.primaryBGColor }}>
      <Head>
        <title>Home</title>
      </Head>

      <div className="max-w-sm w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://articulate.com/packs/images/logos/logo-9c72d20db654121da524f52cd0542b36.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignIn)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>

            {loginChecked &&
              <div>
                <label htmlFor="confirmationCode" className="sr-only">
                Confirmation Code
                </label>
                <input
                  {...register('confirmationCode')}
                  id="confirmationCode"
                  name="confirmationCode"
                  autoComplete="confirmationCode"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmation Code"
                />
              </div>
            }

            {error &&
              <div>
                <p className="text-red-500">{error}</p>
              </div>
            }
            {message &&
              <div>
                <p className="text">{message}</p>
              </div>
            }
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
              Sign in
            </button>
          </div>

          <div className="text-sm">
            <Link
              className="font-medium text-indigo-600 hover:text-indigo-500"
              href="/"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  if(token) {
    const decoded = verify(token, serverRuntimeConfig.secret);
    if(decoded) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        }
      }
    }
  }
  return {
    props: {}
  }
}