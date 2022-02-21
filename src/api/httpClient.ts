import store from "../store";
import fetchJson from "../utils/fetch-json";

export const BASE = 'https://react-learnwords-example.herokuapp.com/';
enum URLS {
  words = 'words',
  users = 'users',
  signin = 'signin'
}

export default {

  getWords({ page = 1, group = 6 }: { page?: number, group?: number } = {}) {
    return fetchJson(`${BASE}${URLS.words}?page=${page}&group=${group}`);
  },

  getWord({ id }: { id: string }) {
    return fetchJson(`${BASE}${URLS.words}/${id}`);
  },

  createUser({ name, email, password }: { name: string, email: string, password: string }) {
    return fetchJson(`
    ${BASE}${URLS.users}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ name, email, password }),
    },
    );
  },

  signin({ email, password }: { email: string, password: string }) {
    return fetchJson(`
    ${BASE}${URLS.signin}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ email, password }),
    },
    );
  },

  getUser({ id }: { id: string }) {
    return fetchJson(`
    ${BASE}${URLS.users}/${id}`,
    {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${store.userData.token}`,
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
    },
    );

  },

}


/*
{
  "name": "string",
  "email": "string",
  "password": "string"
}
*/

