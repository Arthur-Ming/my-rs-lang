import httpClient from './api/httpClient';
import Footer from './components/footer';
import Header from './components/header';
import Component from './core/component';
import { IComponent } from './interfaces';
import Router from './router';
import store from './store';

const template = (): string => `
<div class="wrapper">
  <header class="header" data-element="header"></header>
  <main class="main" data-element="content" id='content'></main>
  <footer class="footer" data-element="footer"></footer>
</div>
`;

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
      } catch (error) {
        store.isSignIn = false
      }

    this.components = {
      header: new Header(),
      footer: new Footer()
    }

    super.renderComponents(this.components)
    router.route({ to: store.currentPage.getState() })

  }
  render() {
    super.render(template())
    this.initComponents()
    return this.element;
  }
}
