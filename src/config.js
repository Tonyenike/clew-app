const apiVersion = 'v1';

let API_ROOT;
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  API_ROOT = `http://localhost:5000/api/${apiVersion}`;
} else {
  API_ROOT = `http://clew-api.herokuapp.com/api/${apiVersion}`;
}

export { API_ROOT };
