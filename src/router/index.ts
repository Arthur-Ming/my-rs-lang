import { IAsyncComponent, IComponent } from '../interfaces';
import store from '../store';
import { PAGE_CHANGE } from '../store/constants';
import renderPage from './renderPage';

export default class Router {

  static instance: Router | null

  static getInstance() {
    if (!this.instance) {
      this.instance = new Router();
    }
    return this.instance;
  }

  private constructor() { }

  page: IAsyncComponent | IComponent | null = null;

  async route({ to }: { to: string }) {

    const { default: Page } = await import(`../pages/${to}/index.ts`);

    const newPage: IAsyncComponent | IComponent = new Page();

    const element: Element | null = await newPage.render();

    renderPage({
      from: this.page,
      to: element,
    });

    this.page = newPage;

    store.currentPage.dispatch({
      type: PAGE_CHANGE,
      page: to
    })
  }
}