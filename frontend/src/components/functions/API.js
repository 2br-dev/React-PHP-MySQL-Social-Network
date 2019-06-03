let API = '';

if (window.location.host.includes('localhost')) {
  /* API = 'http://akvatory.local'; */
  API = 'http://social';
} else {
  API = window.location.origin;
}

export const getJwt = () => {
  let jwt = localStorage.getItem('akv_jwt_token');
  return jwt;
}

export default API;