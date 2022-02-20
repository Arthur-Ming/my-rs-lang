import { IComponent } from "../../../interfaces";
import store from "../../../store";
import { PAGE_CHANGE } from "../../../store/constants";
import { createElement } from "../../../utils/domHelpers";

const toggle = `
<div class="icon-menu">
  <span></span>
  <span></span>
  <span></span>
</div>
`
const list = `
<div class="header__list"></div>
`

const BP = 980

export default class HeaderAdaptive {

  private header: IComponent
  toggler = createElement(toggle)
  list = createElement(list)

  onToggle = () => {
    this.toggler.classList.toggle('icon-menu_active')
    this.header.subElements?.list.classList.toggle('header__list_active')
    document.body.classList.toggle('lock')
  }

  onWindowResize = () => {
    if (Number(document.documentElement.clientWidth) >= BP) {
      this.toggler.classList.remove('icon-menu_active')
      this.header.subElements?.list.classList.remove('header__list_active')
      document.body.classList.remove('lock')
    }
  }

  onPageChange = () => {
    if (Number(document.documentElement.clientWidth) <= BP) {
      this.toggler.classList.remove('icon-menu_active')
      this.header.subElements?.list.classList.remove('header__list_active')
      document.body.classList.remove('lock')
    }
  }

  constructor(Header: IComponent) {
    this.header = Header
    this.header.element?.append(this.toggler)
    this.initEventListeners()
  }

  private initEventListeners(): void {
    this.toggler.addEventListener('click', this.onToggle as unknown as EventListener)
    window.addEventListener('resize', this.onWindowResize as unknown as EventListener)
    store.currentPage.subscribe(PAGE_CHANGE, this.onPageChange)
  }
}