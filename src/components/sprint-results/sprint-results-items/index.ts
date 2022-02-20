import { BASE } from "../../../api/httpClient";
import Component from "../../../core/component";

const template = ({ word, translate }: { word: string, translate: string }) => `
<li class="sprint-results__item sprint-results-item">
  <div class="sprint-results-item__audio" data-result-audio>
    <svg class="audio" viewBox="0 0 128 128">
      <use xlink:href='assets/svg/sprite.svg#audio' />
    </svg>
  </div>
  <div class="sprint-results-item__word">${word}</div>
  <span class="sprint-results-item__dash"></span>
  <div class="sprint-results-item__translate">${translate}</div>
</li>
`

export default class SprintResultsItems extends Component {
  result
  private audio: HTMLAudioElement

  onClick = (event: { target: { closest: Function }; }) => {

    const target = event.target.closest('[data-result-audio]')
    if (!target) return

    this.audioPlay()
  }

  constructor(result: {
    word: string
    audio: string
    translate: string
  }) {
    super()
    this.result = result
    this.audio = new Audio(`${BASE}${this.result.audio}`);
  }
  render() {
    const { word, translate } = this.result
    super.render(template({ word, translate }))
    this.initEventListeners()
    return this.element
  }

  audioPlay() {
    this.audio.play()
  }

  private initEventListeners(): void {
    this.element && this.element.addEventListener('click', this.onClick as unknown as EventListener)
  }
}