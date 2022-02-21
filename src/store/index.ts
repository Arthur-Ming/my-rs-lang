import reducer from "./reducer"
import createStore from "../utils/create-store"

class Store {
  private static instance: null | Store = null
  defaultDictionaryItem: { [wordId: string]: boolean } = {}

  userData: { [data: string]: string } = {
    token: "",
    refreshToken: "",
    userId: "",
    name: ""
  }

  textbookData = {
    page: 0,
    group: 0
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
  textbook = createStore(reducer.textbook, this.textbookData)

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
    localStorage.setItem('textbookData', JSON.stringify(this.textbook.getState()));
  };

  async getLocalStorage() {

    const localStorageItem: string | null = localStorage.getItem('userData');
    const localStorageTextbookData = localStorage.getItem('textbookData')


    this.isSignIn = Boolean(localStorage.getItem('isSignIn'))
    const page = localStorage.getItem('currentPage')
    this.currentPage = createStore(reducer.nav, page ?? 'start')

    if (localStorageItem) {
      const userData = await JSON.parse(localStorageItem);

      if (userData)
        this.userData = userData;
    }

    if (localStorageTextbookData) {
      const textbookData = await JSON.parse(localStorageTextbookData);

      if (textbookData) {
        this.textbookData = textbookData;
        this.textbook = createStore(reducer.textbook, this.textbookData)
      }
    }
  }



  initEventListeners() {
    window.addEventListener('beforeunload', this.setLocalStorage);
  }

}

const store = Store.getInstance()

export default store
