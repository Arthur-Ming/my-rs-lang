import Component from "../../../core/component";
import { IComponent } from "../../../interfaces";
import emit from "../../../utils/emit";

export interface IAudioCallHeader extends IComponent {
  updata(template: string): void
}

const template = () => `
<div class="audio-call__header-content"></div>
`

export default class AudioCallHeader extends Component implements IAudioCallHeader {

  template

  onClick = (event: { target: { closest: Function }; }) => {

    const target = event.target.closest('[data-audio-call-voice]')
    if (!target) return

    emit({
      elem: this.element,
      event: 'audio-call-voice'
    }, true)
  }
  constructor({ template }: { template: string }) {
    super()
    this.template = template
  }

  render() {
    super.render(template())
    this.element && (this.element.innerHTML = this.template)
    this.initEventListeners()
    return this.element
  }

  updata(template: string) {
    this.template = template
    if (this.element) {
      this.element.innerHTML = ''
      this.element.innerHTML = this.template
    }
  }
  initEventListeners() {

    this.element && this.element.addEventListener('click', this.onClick as unknown as EventListener)
  }
}