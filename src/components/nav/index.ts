import Component from "../../core/component";
import Router from "../../router";
import store from "../../store";
import { PAGE_CHANGE } from "../../store/constants";
import { getSubElements } from "../../utils/domHelpers";

const template = () => `
<ul class="nav__list">
  <li class="nav__item" data-nav='textbook'>
    <svg class="nav__icon" viewBox="0 0 1000 1000">
        <use xlink:href='assets/svg/sprite.svg#textbook' />
    </svg>
    <span class="nav__text">Учебник</span>
  </li>
  <li class="nav__item">
    <svg class="nav__icon" viewBox="0 0 1000 1000">
        <use xlink:href='assets/svg/sprite.svg#statistics' />
    </svg>
    <span class="nav__text">Статистика</span>
  </li>
  <li class="nav__item" data-nav='sprint'>
    <svg class="nav__icon" viewBox="0 0 1000 1000">
        <use xlink:href='assets/svg/sprite.svg#sprint' />
    </svg>
    <span class="nav__text">Спринт</span>
  </li>
  <li class="nav__item" data-nav='audio-call'>
    <svg class="nav__icon" viewBox="0 0 24 24">
        <use xlink:href='assets/svg/sprite.svg#game-audio' />
    </svg>
    <span class="nav__text">Аудиовызов</span>
  </li>
</ul>
`

const router = Router.getInstance()

export default class Nav extends Component {

  onNavClick = (event: { target: { closest: Function }; }) => {
    const target = event.target.closest('[data-nav]')

    if (!target) return
    if (target.dataset.nav === store.currentPage.getState()) return;
    router.route({ to: target.dataset.nav })
  }

  onPageChange = () => {
    const page = store.currentPage.getState()

    this.unHighlight()
    this.subElements && this.subElements[page] &&
      this.subElements[page].classList.add('nav__item_active')

  }

  render() {
    super.render(template())
    this.subElements = getSubElements(this.element, '[data-nav]', 'nav')
    this.initEventListeners()
    return this.element
  }

  unHighlight = () => {
    if (this.subElements)
      Object.values(this.subElements).forEach((elem) => {
        elem.classList.remove('nav__item_active')
      })
  }

  private initEventListeners(): void {
    this.element && this.element.addEventListener('click', this.onNavClick as unknown as EventListener)
    store.currentPage.subscribe(PAGE_CHANGE, this.onPageChange)

  }
}