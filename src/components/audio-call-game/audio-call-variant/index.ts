import Component from "../../../core/component";
import { IComponent } from "../../../interfaces";
import emit from "../../../utils/emit";

const template = (word: string) => `
<button class="audio-call__variant">${word}</button>
`

export interface IAudioCallVariant extends IComponent {
  setDisabled(): void
  highlight(id: string): void
}

export default class AudioCallVariant extends Component implements IAudioCallVariant {

  word

  onClick = () => {
    emit({
      elem: this.element,
      event: 'audio-call-variant-click',
      payload: this.word.id
    }, true)
  }

  constructor(word: {
    translate: string,
    id: string
  }) {

    super();
    this.word = word
  }

  render() {
    super.render(template(this.word.translate))
    this.initEventListeners()
    return this.element
  }

  setDisabled(): void {
    if (this.element)
      (<HTMLButtonElement>this.element).disabled = true
  }
  highlight(id: string) {
    if (this.word.id === id) {
      this.element && this.element.classList.add('audio-call__variant_true')
    } else {
      this.element && this.element.classList.add('audio-call__variant_false')
    }
  }
  initEventListeners() {
    this.element && this.element.addEventListener('click', this.onClick as unknown as EventListener)
  }
}