import Component from "../../../../chirsmas-exp/src/core/component";
import { IComponent } from "../../../../chirsmas-exp/src/interfaces";
import store from "../../store";
import {
  MAX_PAGE_TEXTBOOK,
  MIN_PAGE_TEXTBOOK,
  PAGE_DOUBLENEXT,
  PAGE_DOUBLEPREV,
  PAGE_NEXT,
  PAGE_PREV
} from "../../store/constants";
import arrows from "./arrows";


const template = () => `
<div class="pagination__content wrapper__box">
  <button class="pagination__arrow" data-element='doubleprev'>${arrows.doubleprev}</button>
  <button class="pagination__arrow" data-element='prev'>${arrows.prev}</button>
  <div class="pagination__pages">
    <button class="pagination__page" data-element='page'></button>
    <button class="pagination__page pagination__page_gf">/</button>
    <button class="pagination__page">${MAX_PAGE_TEXTBOOK + 1}</button>
  </div>
  <button class="pagination__arrow"  data-element='next'>${arrows.next}</button>
  <button class="pagination__arrow" data-element='doublenext'>${arrows.doublenext}</button>
</div>
  `


export default class Pagination extends Component implements IComponent {

  onNext = () => {
    const { page } = store.textbook.getState()
    if (page === MAX_PAGE_TEXTBOOK) return
    store.textbook.dispatch({ type: PAGE_NEXT })

  }
  onPrev = () => {
    const { page } = store.textbook.getState()
    if (page === MIN_PAGE_TEXTBOOK) return
    store.textbook.dispatch({ type: PAGE_PREV })
  }

  onDoubleNext = () => {
    const { page } = store.textbook.getState()
    if (page === MAX_PAGE_TEXTBOOK) return
    store.textbook.dispatch({ type: PAGE_DOUBLENEXT })
  }

  onDoublePrev = () => {
    const { page } = store.textbook.getState()
    if (page === MIN_PAGE_TEXTBOOK) return
    store.textbook.dispatch({ type: PAGE_DOUBLEPREV })
  }

  render() {
    super.render(template())
    this.setPage()
    this.setArrows()
    this.initEventListeners()
    return this.element
  }

  setPage = () => {
    const { page } = store.textbook.getState()
    this.subElements && (this.subElements.page.textContent = String(page + 1))
    this.setArrows()
  }

  setArrows = () => {
    const { page } = store.textbook.getState()
    switch (page) {
      case MIN_PAGE_TEXTBOOK:
        if (this.subElements) {
          (<HTMLButtonElement>this.subElements.prev).disabled = true;
          (<HTMLButtonElement>this.subElements.doubleprev).disabled = true;
          (<HTMLButtonElement>this.subElements.next).disabled = false;
          (<HTMLButtonElement>this.subElements.doublenext).disabled = false;
        }
        break;
      case MAX_PAGE_TEXTBOOK:
        if (this.subElements) {
          (<HTMLButtonElement>this.subElements.next).disabled = true;
          (<HTMLButtonElement>this.subElements.doublenext).disabled = true;
          (<HTMLButtonElement>this.subElements.prev).disabled = false;
          (<HTMLButtonElement>this.subElements.doubleprev).disabled = false
        }
        break;
      default:
        if (this.subElements) {
          (<HTMLButtonElement>this.subElements.prev).disabled = false;
          (<HTMLButtonElement>this.subElements.doubleprev).disabled = false;
          (<HTMLButtonElement>this.subElements.next).disabled = false;
          (<HTMLButtonElement>this.subElements.doublenext).disabled = false
        }
        break;
    }
  }

  private initEventListeners(): void {
    if (this.subElements) {
      this.subElements.next.addEventListener('click', this.onNext)
      this.subElements.prev.addEventListener('click', this.onPrev)
      this.subElements.doublenext.addEventListener('click', this.onDoubleNext)
      this.subElements.doubleprev.addEventListener('click', this.onDoublePrev)
    }
    store.textbook.subscribe(PAGE_NEXT, this.setPage)
    store.textbook.subscribe(PAGE_PREV, this.setPage)
    store.textbook.subscribe(PAGE_DOUBLENEXT, this.setPage)
    store.textbook.subscribe(PAGE_DOUBLEPREV, this.setPage)
  }
}