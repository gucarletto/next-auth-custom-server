import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from 'next/router'

import { recoverUserInformation, signInRequest, signUpRequest } from "../services/auth";
import { api } from "../services/api";

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      recoverUserInformation(token).then(response => {
        setUser(response)
      })
    }
  }, [])

  async function signIn({ email, password }) {
    const { token, user } = await signInRequest({
      email,
      password,
    })

    setCookie(undefined, 'nextauth.token', token, {
      maxAge: 60 * 60 * 4, // 4 hours
    })

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    setUser(user)

    Router.push('/dashboard');
  }

  async function signUp({ email, firstName, lastName, password }) {

    const { token, user } = await signUpRequest({
      email,
      firstName,
      lastName,
      password,
    })

    setCookie(undefined, 'nextauth.token', token, {
      maxAge: 60 * 60 * 4, // 4 hours
    })

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    setUser(user)

    Router.push('/dashboard');
  }

  function signOut() {
    destroyCookie(undefined, 'nextauth.token');
    api.defaults.headers['Authorization'] = null;
    setUser(null);

    Router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}