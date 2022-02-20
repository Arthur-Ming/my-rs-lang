import Component from "../../core/component";
import { CardType } from "../../types";
import audioCallButtonArrow from "./audioCallButtonArrow";
import AudioCallVariant from "./audio-call-variant";
import { IAudioCallVariant } from "./audio-call-variant";
import store from "../../store";
import emit from "../../utils/emit";
import getRandomInt from "../../utils/getRandomInt";
import httpClient, { BASE } from "../../api/httpClient";
import withLouding from "../../utils/withLouding";
import shuffle from "../../utils/shuffle";
import { IComponent } from "../../interfaces";
import AudioCallHeader, { IAudioCallHeader } from "./audio-call-header";
import getAudioCallIcon from "./getAudioCallIcon";
import getAudioCallShowAnswer from "./getAudioCallShowAnswer";
import AudioCallProgress, { IAudioCallProgress } from "./audio-call-progress";

const template = () => `
<div class="audio-call__game">
   <div class="sprint-game__sound-icon ${store.audioCallSound ? 'sprint-game__sound-icon_active' : ''} " 
        data-element='sprint-sound'
    data-tooltip='Звуковое сопровождение'>
      <svg class="sprint-game__sound-icon_act"  viewBox="0 0 24 24">
        <use xlink:href='assets/svg/sprite.svg#sound-active' />
      </svg>
      <svg class="sprint-game__sound-icon_mute" viewBox="0 0 24 24">
        <use xlink:href='assets/svg/sprite.svg#sound-mute' />
      </svg>
   </div>
  <div class="audio-call__progress" data-element='audio-call-progress'></div>
  <div class="audio-call__header" data-element='audio-call-header'></div>
  <div class="audio-call__variants" data-element='audio-call-variants'></div>
  <div class="audio-call__buttons" data-element='audio-call-buttons'>
    <button class="audio-call__button audio-call__button_know button"
    data-audio-call-unknow>Не знаю</button>
    <button class="audio-call__button audio-call__button_unknow button"
    data-audio-call-next > ${audioCallButtonArrow()}</button>
  </div>
</div>
`
//audio-call_unknown
// <div class="audio-call__call"  data-audio-call-voice>${audioCallIcon()}</div>
const WORDS_ON_PAGE = 20
const PAGES_NUM = 30

export default class AudioCallGame extends Component {

  components!: {
    'audio-call-progress': IAudioCallProgress,
    'audio-call-header': IAudioCallHeader,
  }

  data!: CardType[]
  audioCallVariants!: IAudioCallVariant[]
  pages: number[] = []
  answers: { [key: string]: boolean } = {}
  level: number = 0
  currentTrueAnswer!: { word: string, wordTranslate: string, id: string, audio: string, image: string }
  currentVarints: { word: string, wordTranslate: string, id: string, audio: string, image: string }[] = []

  indexOfCurrentTrueAnswer: number = 0
  audio = new Audio()
  sound = new Audio()

  onSoundClick = (event: { target: any; }) => {
    // event.preventDefault()
    const target = event.target.closest('[data-element]');
    target.classList.toggle('sprint-game__sound-icon_active')
    store.audioCallSound = !store.audioCallSound
  }

  onKeyDown = (event: { key: any; code: any; preventDefault: Function }) => {

    const key = event.key
    const code = event.code

    if (key === ' ') {
      event.preventDefault()
      this.voice()
    }
    if (key === 'Enter') {
      event.preventDefault()
      if (this.subElements && this.subElements['audio-call-buttons']) {
        let elem = this.subElements['audio-call-buttons'].classList.contains('audio-call_unknown') ?
          this.subElements['audio-call-buttons'].querySelector('[data-audio-call-next]') :
          this.subElements['audio-call-buttons'].querySelector('[data-audio-call-unknow]')
        if (elem)
          this.onButtonClick({ target: elem })
      }
    }
    if (key === '1' || key === '2' || key === '3' || key === '4' || key === '5') {
      event.preventDefault()
      const { id } = this.currentVarints[Number(key) - 1]
      if (this.subElements && this.subElements['audio-call-variants']) {
        emit({
          elem: this.subElements['audio-call-variants'],
          event: 'audio-call-variant-click',
          payload: id
        })
      }
    }
    if (code === 'KeyM') {
      event.preventDefault()
      const elem = this.subElements && this.subElements['sprint-sound']
      if (elem)
        this.onSoundClick({ target: elem })
    }
  }

  onAudioCallVariantClick = (event: CustomEvent) => {
    this.setDisabledVariants()
    const isTrue = (this.currentTrueAnswer.id === event.detail)
    this.setAnswer(this.currentTrueAnswer.id, isTrue)
    this.showAnswer()
    this.subElements && this.subElements['audio-call-buttons'].classList.add('audio-call_unknown')
  }

  onGameOver = () => {
    emit({
      elem: this.element,
      event: 'audio-call-over',
      payload: { ...this.answers }
    }, true)
  }

  onButtonClick = (event: { target: { closest: Function }; }) => {
    const unknow = event.target.closest('[data-audio-call-unknow]')

    if (unknow) {
      this.subElements && this.subElements['audio-call-buttons'].classList.add('audio-call_unknown')
      this.setDisabledVariants()
      this.setAnswer(this.currentTrueAnswer.id, false)
      this.showAnswer()
      return
    }

    const next = event.target.closest('[data-audio-call-next]')
    if (next) {
      this.showCallIcon()
      this.getRound()
    }
  }
  constructor({
    level
  }: { level?: number }) {
    super()
    this.level = level ?? 1

  }

  async init() {
    this.initComponents()
    this.initEventListeners()
    this.getPage()
    this.getLevel()
    await this.getData()
    this.getRound()

  }

  initComponents() {
    this.components = {
      'audio-call-progress': new AudioCallProgress(),
      'audio-call-header': new AudioCallHeader({ template: getAudioCallIcon() })
    }
    super.renderComponents(this.components)
    this.initEventListeners()
  }

  render() {
    super.render(template())
    this.init()
    return this.element
  }

  private showAnswer() {
    const { image, word, wordTranslate } = this.currentTrueAnswer
    this.components['audio-call-header'].updata(getAudioCallShowAnswer(image, word, wordTranslate))

  }
  private showCallIcon() {
    this.components['audio-call-header'].updata(getAudioCallIcon())
  }

  private setAnswer(id: string, answer: boolean) {
    this.answers = {
      ...this.answers,
      [id]: answer
    }

    this.audioCallVariants.forEach((audioCallVariant) => {
      audioCallVariant.highlight(this.currentTrueAnswer.id)
    })

    this.components['audio-call-progress'].updata(this.answers)

    if (answer) {
      this.ok()
    } else {
      this.error()
    }
  }

  ok() {
    if (store.audioCallSound) {
      this.sound.src = 'assets/sounds/ok.wav';
      this.sound.play();
    }
  }

  error() {
    if (store.audioCallSound) {
      this.sound.src = 'assets/sounds/error.wav';
      this.sound.play();
    }
  }

  getWord() {
    while (true) {
      this.indexOfCurrentTrueAnswer = getRandomInt(0, WORDS_ON_PAGE)
      const { word, wordTranslate, id, audio, image } = this.data[this.indexOfCurrentTrueAnswer]

      if (!Object.keys(this.answers).includes(id, (WORDS_ON_PAGE * (this.pages.length - 1)))) {
        return { word, wordTranslate, id, audio, image }
      }
    }
  }

  private getPage() {

    let page = 0
    if (this.pages.length === PAGES_NUM) this.onGameOver()

    if (store.sprintMode === 'textbook') {
      page = this.getPrevPage() ?? 0
    }
    if (store.sprintMode === 'free')
      page = this.getRandomPage()

    this.pages.push(page)

    return page
  }

  private getPrevPage() {
    const currentPage = this.getCurrentPage()
    if (currentPage === null) {
      const { page } = store.textbook.getState()
      return page
    }
    if (currentPage > 0) return currentPage - 1
    if (currentPage === 0) this.onGameOver()
  }

  private getRandomPage() {
    while (true) {
      const page = getRandomInt(0, PAGES_NUM)
      if (!this.pages.includes(page)) {
        return page
      }
    }
  }

  private getCurrentPage(): number | null {

    if (!this.pages.length) return null

    return this.pages[this.pages.length - 1]
  }

  private getLevel() {
    if (store.sprintMode === 'textbook') {
      const { group } = store.textbook.getState()
      this.level = group
    }

    return this.level
  }


  private async getData() {
    const page = this.getCurrentPage() ?? 0

    const data = await httpClient.getWords({
      group: this.level,
      page: page
    })
    this.data = data
    return data
  }

  getVariants() {
    const indexes = this.getVariantsIndexes()
    this.currentVarints = []
    return indexes.map((index) => {
      this.currentVarints.push(this.data[index])
      return this.data[index]
    })
  }

  private getVariantsIndexes() {
    const varintsIndexes = []
    varintsIndexes.push(this.indexOfCurrentTrueAnswer)

    while (true) {
      const index = getRandomInt(0, WORDS_ON_PAGE)

      if (!varintsIndexes.includes(index)) {
        varintsIndexes.push(index)
      }

      if (varintsIndexes.length === 5) {
        shuffle(varintsIndexes)
        return varintsIndexes

      }
    }
  }

  getRound() {

    if (Object.keys(this.answers).length === WORDS_ON_PAGE) {
      this.onGameOver()
      return
    }

    this.subElements &&
      this.subElements['audio-call-buttons'].classList.remove('audio-call_unknown');
    this.currentTrueAnswer = this.getWord()
    this.renderVariants(this.getVariants())
    this.voice()
  }

  voice = () => {
    this.audio.src = `${BASE}${this.currentTrueAnswer.audio}`
    this.audio.play()
  }

  renderVariants(variants: CardType[]) {
    this.audioCallVariants = [];
    this.subElements && (this.subElements['audio-call-variants'].innerHTML = '');
    variants.forEach(({ id, wordTranslate }) => {
      const audioCallVariant = new AudioCallVariant({ id, translate: wordTranslate })
      const element = audioCallVariant.render()
      this.audioCallVariants.push(audioCallVariant)
      this.subElements && element &&
        this.subElements['audio-call-variants'].append(element)
    })
  }

  setDisabledVariants() {
    this.audioCallVariants.forEach((audioCallVariant) => audioCallVariant.setDisabled())
  }

  initEventListeners() {
    if (this.subElements && this.subElements['audio-call-variants']) {
      this.subElements['audio-call-variants']
        .addEventListener('audio-call-variant-click', this.onAudioCallVariantClick as unknown as EventListener)
    }

    const { element: header } = this.components['audio-call-header']
    header && header.addEventListener('audio-call-voice', this.voice as unknown as EventListener)

    if (this.subElements && this.subElements['audio-call-buttons']) {
      this.subElements['audio-call-buttons']
        .addEventListener('click', this.onButtonClick as unknown as EventListener)
    }

    if (this.subElements && this.subElements['sprint-sound'])
      this.subElements['sprint-sound'].addEventListener('click', this.onSoundClick as unknown as EventListener)

    this.element &&
      window.addEventListener('keydown', this.onKeyDown as unknown as EventListener)

  }

}