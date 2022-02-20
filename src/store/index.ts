import reducer from "./reducer"
import createStore from "../utils/create-store"



class Store {
  private static instance: null | Store = null
  defaultDictionaryItem: { [wordId: string]: boolean } = {
    /*  "5e9f5ee35eb9e72bc21af4a0": true,
     "5e9f5ee35eb9e72bc21af4a2": true,
     "5e9f5ee35eb9e72bc21af4a1": false */
  }

  userData: { [data: string]: string } = {
    token: "",
    refreshToken: "",
    userId: "",
    name: ""
  }

  static getInstance() {
    if (!this.instance)
      this.instance = new Store
    return this.instance
  }

  private constructor() {
    this.initEventListeners()
  }

  activeAudioCard = createStore(reducer.audio, '')
  textbook = createStore(reducer.textbook, {
    page: 0,
    group: 0
  })

  currentPage = createStore(reducer.nav, 'start')

  dictionary = createStore(reducer.dictionary, this.defaultDictionaryItem)

  sprintMode: 'free' | 'textbook' = 'free'
  sprintSound = true
  audioCallSound = true

  isSignIn = false

  setLocalStorage = () => {
    const isSignIn = this.isSignIn ? 'true' : ''
    localStorage.setItem('userData', JSON.stringify(this.userData));
    localStorage.setItem('isSignIn', isSignIn);
    localStorage.setItem('currentPage', this.currentPage.getState());

  };

  async getLocalStorage() {

    const localStorageItem: string | null = localStorage.getItem('userData')
    this.isSignIn = Boolean(localStorage.getItem('isSignIn'))
    const page = localStorage.getItem('currentPage')
    this.currentPage = createStore(reducer.nav, page ?? 'start')

    if (!localStorageItem) return

    const userData = await JSON.parse(localStorageItem);

    if (userData)
      this.userData = userData;
  }

  initEventListeners() {
    window.addEventListener('beforeunload', this.setLocalStorage);
  }

}

const store = Store.getInstance()

export default store

/* "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGRmZDhlNzI1MTU1MDAxNWEyMTA2OSIsImlhdCI6MTY0NTA4NDkxNCwiZXhwIjoxNjQ1MDk5MzE0fQ.fCxc5GPq-ObVtcSxgfyq5Zm-dmtDSackdhtyo_8gFQY",
"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGRmZDhlNzI1MTU1MDAxNWEyMTA2OSIsInRva2VuSWQiOiJiN2Y4NjBkOS02YmU3LTQ5MzktOTQxZC1jNTc2ZGYxNzJiOWYiLCJpYXQiOjE2NDUwODQ5MTQsImV4cCI6MTY0NTEwMTExNH0.-i7YyGCoqgaeNqJNpssO_gYNZdKRCaY0jY_gwySCPBg",
"userId": "620dfd8e7251550015a21069",
"name": "art" */