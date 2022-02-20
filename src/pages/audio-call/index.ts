import AudioCallGame from "../../components/audio-call-game";
import SprintEntry from "../../components/sprint-entry";
import SprintResults from "../../components/sprint-results";
import Component from "../../core/component";
import { IComponent } from "../../interfaces";
import store from "../../store";
import audioCallEntry from "./audio-call-entry";

const template = () => `
<div class="audio-call">
  <div class="audio-call__content wrapper__box" data-element='audio-call-content'></div>
</div>
`

export default class AudioCall extends Component {

  level: number = store.textbook.getState().group

  private components!: {
    [componentName: string]: IComponent
  };

  onSprintLevelSelected = (event: CustomEvent) => {

    this.level = Number(event.detail)
    console.log(this.level)
  }

  onAudioCallStart = () => {

    this.components['audio-call-content'].destroy()

    this.components = {
      'audio-call-content': new AudioCallGame({ level: this.level })
    }
    super.renderComponents(this.components)
  }

  onAudioCallOver = (event: CustomEvent) => {

    this.components['audio-call-content'].destroy()

    this.components = {
      'audio-call-content': new SprintResults({ results: event.detail })
    }
    super.renderComponents(this.components)

  }


  initComponents() {

    this.components = {
      'audio-call-content': new SprintEntry({ entry: audioCallEntry })
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
    if (this.subElements && this.subElements['audio-call-content']) {
      this.subElements['audio-call-content'].addEventListener('sprint-level', this.onSprintLevelSelected as unknown as EventListener)
      this.subElements['audio-call-content'].addEventListener('sprint-start', this.onAudioCallStart as unknown as EventListener)
      this.subElements['audio-call-content'].addEventListener('audio-call-over', this.onAudioCallOver as unknown as EventListener)
    }
  }
}