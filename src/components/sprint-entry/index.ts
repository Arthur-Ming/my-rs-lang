import Component from "../../core/component";
import { IComponent } from "../../interfaces";
import store from "../../store";
import emit from "../../utils/emit";
import SprintChoice from "./sprint-choice";

const template = (isLevelSelected: boolean, entry: string) => `
<div class="sprint__entry sprint-entry">
<div class="sprint-entry__content">
   ${entry}
    <div class="sprint-entry__choice ${isLevelSelected ? '_hidden' : ''}" 
    data-element='sprint-choice' ></div>
    <button class="sprint-entry__button button" 
       data-element='sprint-start' ${isLevelSelected ? '' : 'disabled'}>
       <span>Начать</span>
    </button>
</div>
</div>
`
/*
<h4 class="sprint-entry__title">Спринт</h4>
<h5 class="sprint-entry__description">Попробуйте перевести как можно больше слов за 60 секунд</h5>
*/

export default class SprintEntry extends Component implements IComponent {

  private isLevelSelected: boolean
  private components!: {
    [componentName: string]: IComponent
  };

  entry
  onClick = () => {
    emit({
      elem: this.element,
      event: 'sprint-start'
    }, true)
  }

  onSprintLevelSelected = () => {
    this.isLevelSelected = true
    if (this.subElements)
      (<HTMLButtonElement>this.subElements['sprint-start']).disabled = false
  }

  initComponents() {

    this.components = {
      'sprint-choice': new SprintChoice
    }

    super.renderComponents(this.components)

  }

  constructor({ entry }: { entry: string }) {
    super()
    console.log(store.sprintMode)
    this.isLevelSelected = (store.sprintMode === 'textbook') ? true : false
    this.entry = entry
  }

  render() {
    super.render(template(this.isLevelSelected, this.entry))
    this.initComponents()
    this.initEventListeners()
    return this.element
  }

  private initEventListeners(): void {
    if (this.subElements) {
      this.subElements['sprint-start'].addEventListener('click', this.onClick as unknown as EventListener)
      this.subElements['sprint-choice'].addEventListener('sprint-level', this.onSprintLevelSelected as unknown as EventListener)
    }
  }
}