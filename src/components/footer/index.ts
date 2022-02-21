import Component from "../../core/component";
import { IComponent } from "../../interfaces";
import store from "../../store";
import { PAGE_CHANGE } from "../../store/constants";

const template = (): string => `
<div class="footer__content wrapper__box">
  <div class="rss-logo-year">
    <a class="rss-logo" href="https://rs.school/js/">
     <img src="assets/rs_school_js _w.svg" alt="rss-logo">
    </a>
    <span class="year">2022</span>
  </div>
 
  <a href="https://github.com/Arthur-Ming" class="author">Arthur-Ming</a>
</div>
`;

export default class Footer extends Component implements IComponent {

  onPageChange = () => {
    const page = store.currentPage.getState()
    if (page === 'sprint' || page === 'audio-call') {
      this.element && this.element.classList.add('_hidden')
    } else {
      this.element && this.element.classList.remove('_hidden')
    }
  }

  render(): Element | null {
    super.render(template())
    this.initEventListeners()
    return this.element;
  }

  private initEventListeners(): void {
    store.currentPage.subscribe(PAGE_CHANGE, this.onPageChange)
  }
}