import axios from "axios";
import { parseCookies } from "nookies";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const baseUrl = publicRuntimeConfig.apiUrl

export function getAPIClient(ctx) {
  const { 'nextauth.token': token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: baseUrl,
  })

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return api;
}