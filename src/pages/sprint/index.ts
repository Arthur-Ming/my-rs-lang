import SprintEntry from "../../components/sprint-entry";
import SprintGame from "../../components/sprint-game";
import SprintResults from "../../components/sprint-results";
import Component from "../../core/component";
import { IComponent } from "../../interfaces";
import store from "../../store";
import sprintEntry from "./sprint-entry";

const template = () => `
<div class="sprint">
  <div class="sprint__content wrapper__box" data-element='sprint-content'></div>
</div>
`

export default class Sprint extends Component implements IComponent {

  level: number = store.textbook.getState().group

  private components!: {
    [componentName: string]: IComponent
  };

  onSprintLevelSelected = (event: CustomEvent) => {

    this.level = Number(event.detail)
    console.log(this.level)
  }

  onSprintStart = () => {

    this.components['sprint-content'].destroy()

    this.components = {
      'sprint-content': new SprintGame({ level: this.level })
    }
    super.renderComponents(this.components)
  }

  onSprintOver = (event: CustomEvent) => {

    this.components['sprint-content'].destroy()

    this.components = {
      'sprint-content': new SprintResults({ results: event.detail })
    }
    super.renderComponents(this.components)

  }

  initComponents() {

    this.components = {
      'sprint-content': new SprintEntry({ entry: sprintEntry }),
    }

    super.renderComponents(this.components)
    this.initEventListeners()
  }

  render() {
    super.render(template())
    this.initComponents()
    return this.element
  }

  private initEventListeners(): void {

    if (this.subElements && this.subElements['sprint-content']) {
      this.subElements['sprint-content'].addEventListener('sprint-level', this.onSprintLevelSelected as unknown as EventListener)
      this.subElements['sprint-content'].addEventListener('sprint-start', this.onSprintStart as unknown as EventListener)
      this.subElements['sprint-content'].addEventListener('sprint-over', this.onSprintOver as unknown as EventListener)
    }
  }
}