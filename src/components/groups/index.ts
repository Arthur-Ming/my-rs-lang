import Component from "../../core/component";
import { IComponent } from "../../interfaces";
import store from "../../store";
import { GROUP_SELECT } from "../../store/constants";
import { getSubElements } from "../../utils/domHelpers";

const getItems = () => {
  return [0, 1, 2, 3, 4, 5].map((item) => {
    const { group } = store.textbook.getState()
    const isActive = (group === item) ? 'groups__item_active' : ''
    return `<div class="groups__item groups__item_color-${item + 1}
            ${isActive}" data-group=${item}>${item + 1}</div>`
  }).join('')
}

const template = () => `
<div class="groups__content">
    <div class="groups__title">Раздел:</div>
    <div class="groups__items">${getItems()}</div>
</div>
`

export interface IGroups extends IComponent {
  removeActive(): void
}

export default class Groups extends Component implements IGroups {

  onClick = (event: { target: { closest: (arg0: string) => HTMLElement | null; }; }) => {

    const target = event.target.closest('[data-group]')
    if (!target) return

    this.removeActive()
    target.classList.add('groups__item_active')

    const { group } = store.textbook.getState()

    if (group === Number(target.dataset.group)) return

    store.textbook.dispatch({
      type: GROUP_SELECT,
      group: Number(target.dataset.group)
    })
  }

  render() {
    super.render(template())
    this.subElements = getSubElements(this.element, '[data-group]', 'group')
    this.initEventListeners()
    return this.element
  }

  removeActive = () => {
    this.subElements &&
      Object.values(this.subElements)
        .forEach((item) => item.classList.remove('groups__item_active'))
  }

  private initEventListeners(): void {
    this.element && this.element.addEventListener('click', this.onClick as unknown as EventListener)
  }
}