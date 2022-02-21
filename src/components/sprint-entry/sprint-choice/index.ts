import Component from "../../../core/component";
import { IComponent } from "../../../interfaces";
import { getSubElements } from "../../../utils/domHelpers";
import emit from "../../../utils/emit";

const getItems = () => [0, 1, 2, 3, 4, 5]
  .map(item => `<div class="sprint-entry-choice__item" data-slevels=${item}>${item + 1}</div>`)
  .join('')

const template = () => `
<div class="sprint-entry-choice">
  <h5 class="sprint-entry-choice__title">Выберите уровень:</h5>
  <div class="sprint-entry-choice__choice">${getItems()}</div>
</div>
`
export default class SprintChoice extends Component implements IComponent {

  onClick = (event: { target: { closest: (arg0: string) => HTMLElement | null; }; }) => {

    const target = event.target.closest('[data-slevels]')

    if (!target) return

    this.removeActive()
    target.classList.add('sprint-entry-choice__item_active')

    emit({
      event: 'sprint-level',
      elem: this.element,
      payload: target.dataset.slevels
    }, true)
  }

  render() {
    super.render(template())
    this.initEventListeners()
    this.subElements = getSubElements(this.element, '[data-slevels]', 'slevels')
    return this.element
  }

  private removeActive = () => {
    this.subElements &&
      Object.values(this.subElements)
        .forEach((item) => item.classList.remove('sprint-entry-choice__item_active'))
  }

  private initEventListeners(): void {
    this.element && this.element.addEventListener('click', this.onClick as unknown as EventListener)
  }
}