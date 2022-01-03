import { api } from "./api"

export async function signInRequest(data) {
  const response = await api.post('/auth', data);
  return response.data;
}

export async function signInCheckRequest(data) {
  const response = await api.post('/authcheck', data);
  return response.data
}

export async function signUpRequest(data) {
  const response = await api.post('/signup', data)
  return response.data;
}

export async function getTotpTokenRequest() {
  const response = await api.get('/totp');
  return response.data;
}

export async function validateTotpTokenRequest(data) {
  const response = await api.post('/totp', {
    code: data.confirmationCode,
  });
  return response.data;
}

export async function recoverUserInformation(token) {
  const response = await api.get('/users/recover');
  return response.data;
}