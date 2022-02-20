import httpClient from './api/httpClient';
import Footer from './components/footer';
import Header from './components/header';
import Component from './core/component';
import { IComponent } from './interfaces';
import AudioCall from './pages/audio-call';
import Login from './pages/login';
import Sprint from './pages/sprint';
import Start from './pages/start';
import Router from './router';
import store from './store';

const template = (): string => `
<div class="wrapper">
  <header class="header" data-element="header"></header>
  <main class="main" data-element="content" id='content'></main>
  <footer class="footer" data-element="footer"></footer>
</div>
`;
console.log('app')
const router = Router.getInstance()

export default class App extends Component implements IComponent {

  private components!: {
    [componentName: string]: IComponent
  };

  async initComponents() {

    await store.getLocalStorage()
    if (store.isSignIn)
      try {
        await httpClient.getUser({
          id: store.userData.userId
        })
        //store.isSignIn = true
      } catch (error) {
        store.isSignIn = false
        console.log('error in app', error)
      }




    this.components = {
      header: new Header(),
      //  content: new Start(),
      footer: new Footer()
    }

    super.renderComponents(this.components)
    console.log(store.currentPage.getState())
    router.route({ to: store.currentPage.getState() })

  }
  render() {
    super.render(template())
    this.initComponents()
    return this.element;
  }

}
