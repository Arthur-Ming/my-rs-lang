import Component from "../../../core/component";
import { IComponent } from "../../../interfaces";
import { createElement } from "../../../utils/domHelpers";

const WORDS_ON_PAGE = 20
const items = Array
  .from(Array(WORDS_ON_PAGE), () =>
    createElement('<div class="audio-call-progress__item"></div>'))

const template = () => `
<div class="audio-call-progress"></div>
`

export interface IAudioCallProgress extends IComponent {
  updata(answers: { [key: string]: boolean }): void
}

export default class AudioCallProgress extends Component implements IAudioCallProgress {

  render() {
    super.render(template())
    this.element && this.element.append(...items)
    return this.element
  }

  updata(answers: { [key: string]: boolean; }): void {
    const values = Object.values(answers)
    items.forEach((item, index) => {
      if (values[index] === true)
        item.classList.add('audio-call-progress__item_true')
      else if (values[index] === false) {
        item.classList.add('audio-call-progress__item_false')
      }
    })
  }
}

