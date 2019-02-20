let API = '';

if (window.location.host.includes('localhost')) {
  API = 'http://akvatory.local';
} else {
  API = window.location.origin;
}

export default API;