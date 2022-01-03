import Head from 'next/head'
import Link from 'next/link'
import { LockClosedIcon } from '@heroicons/react/solid'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form'
import { useContext } from 'react';
import { parseCookies } from 'nookies';
import { verify } from 'jsonwebtoken';
import getConfig from 'next/config';
import variables from '../styles/variables.module.scss'

import { AuthContext } from '../contexts/AuthContext';
const { serverRuntimeConfig } = getConfig();

export default function SignUp() {
  const { signUp } = useContext(AuthContext)

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('E-Mail is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, setError } = useForm(formOptions);
  const { errors } = formState;

  async function handleSignUp(data) {
    try {
      await signUp(data)
    } catch (error) {
      setError('apiError', { message: error });
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignUp)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <input
                {...register('firstName')}
                id="firstName"
                name="firstName"
                autoComplete="firstName"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
              />
              <div className="invalid-feedback">{errors.firsName?.message}</div>
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <input
                {...register('lastName')}
                id="lastName"
                name="lastName"
                autoComplete="lastName"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
              />
              <div className="invalid-feedback">{errors.lastName?.message}</div>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
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
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Password
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="confirmPassword"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
              <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
              Sign Up
            </button>
          </div>
          {errors.apiError &&
              <div className="alert alert-danger mt-3 mb-0">{errors.apiError?.message}</div>
          }

          <div className="text-sm">
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
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