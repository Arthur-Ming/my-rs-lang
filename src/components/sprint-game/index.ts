import Component from "../../core/component";
import Notification from "../notification";
import getRandomInt from "../../utils/getRandomInt";
import CircleTimer from "../circle-timer";
import { CardType } from '../../types'
import httpClient, { BASE } from "../../api/httpClient";
import withLouding from "../../utils/withLouding";
import store from "../../store";
import emit from "../../utils/emit";
import ShowScore from "./show-score";

const WORDS_ON_PAGE = 20
const PAGES_NUM = 30

const template = () => `
<div class="sprint-game">
  <div class="sprint-game__content wrapper__box" data-element='sprint-content'>
    <div class="sprint-game__header">
      <div class="sprint-game__sound-icon ${store.sprintSound ? 'sprint-game__sound-icon_active' : ''} " 
        data-element='sprint-sound'
        data-tooltip='Звуковое сопровождение'
        >
        <svg class="sprint-game__sound-icon_act"  viewBox="0 0 24 24">
           <use xlink:href='assets/svg/sprite.svg#sound-active' />
        </svg>
        <svg class="sprint-game__sound-icon_mute" viewBox="0 0 24 24">
           <use xlink:href='assets/svg/sprite.svg#sound-mute' />
        </svg>
      </div>
      <div class="sprint-game__audio-icon" data-element='sprint-audio'
      data-tooltip='Произношение слова'
      > 
         <svg class="audio" viewBox="0 0 128 128">
           <use xlink:href='assets/svg/sprite.svg#audio' />
        </svg>
      </div>
      <h5 class="sprint-game__header-title">Ваш результат: </h5>
      <h5 class="sprint-game__header-result" data-element='sprint-score'></h5>
    </div>
    <div class="sprint-game__words">
      <div class="sprint-game__word" data-element='sprint-word'></div>
      <div class="sprint-game__var" data-element='sprint-translate'></div>
    </div>
    <div class="sprint-game__buttons" data-element='sprint-button'>
      <button class="sprint-game__button sprint-game__button_fl button" data-element='sprint-answer-false'>
        <span>Неверно</span>
      </button>
      <button class="sprint-game__button sprint-game__button_tr button" data-element='sprint-answer-true'>
        <span>Верно</span>
      </button>
    </div>
  </div>
</div>
`

export default class SprintGame extends Component {
  timer = new CircleTimer()
  data!: CardType[]
  level: number = 1
  isTrue: boolean = false
  pages: number[] = []
  answers: { [key: string]: boolean } = {}
  currentWordId!: string
  score: number = 0
  sound = new Audio()
  audio = new Audio()

  onSoundClick = (event: { target: any; }) => {

    const target = event.target.closest('[data-element]');
    target.classList.toggle('sprint-game__sound-icon_active')
    store.sprintSound = !store.sprintSound
  }

  onAudioClick = () => {
    this.audio.play()
  }

  onKeyDown = (event: { key: any; code: any; preventDefault: Function }) => {

    const key = event.key
    const code = event.code
    let isTrueAnswer = false

    if (code === 'KeyM') {
      event.preventDefault()
      const elem = this.subElements && this.subElements['sprint-sound']
      if (elem)
        this.onSoundClick({ target: elem })

      return
    }

    if (key === 'ArrowRight') {
      isTrueAnswer = this.isTrue ? true : false
    }
    if (key === 'ArrowLeft') {
      isTrueAnswer = this.isTrue ? false : true
    }

    this.setAnswer(this.currentWordId, isTrueAnswer)
    this.getRound()
  }


  onClick = (event: { target: { closest: (arg0: string) => any; }; }) => {
    const target = event.target.closest('[data-element]')
    if (!target) return

    let isTrueAnswer = false
    if (target.dataset.element === 'sprint-answer-false')
      isTrueAnswer = this.isTrue ? false : true
    if (target.dataset.element === 'sprint-answer-true')
      isTrueAnswer = this.isTrue ? true : false

    this.setAnswer(this.currentWordId, isTrueAnswer)
    this.getRound()
  }

  onGameOver = () => {
    emit({
      elem: this.element,
      event: 'sprint-over',
      payload: { ...this.answers }
    }, true)

  }

  private setAnswer(id: string, answer: boolean) {
    this.answers = {
      ...this.answers,
      [id]: answer
    }
    if (answer) {
      this.score += 10;
      this.setScore()
      this.ok()
      this.subElements &&
        new ShowScore({
          message: '+10',
          duration: 3000
        }).show(this.subElements['sprint-content']);

    } else {
      this.error()
    }
  }

  constructor({
    level
  }: { level?: number }) {
    super()
    this.level = level ?? 1

  }

  private async initGame() {

    this.getPage()
    this.getLevel()
    await withLouding(this.getData())
    await this.getRound()
    this.timer.start()
  }

  private getLevel() {
    if (store.sprintMode === 'textbook') {
      const { group } = store.textbook.getState()
      this.level = group
    }

    return this.level
  }

  private getPage() {

    let page = 0
    if (this.pages.length === PAGES_NUM) {
      this.element &&
        new Notification({
          message: 'Недостаточно слов',
          duration: 6000
        }).show();
      this.onGameOver()
    }
    console.log(store.sprintMode)
    if (store.sprintMode === 'textbook') {

      page = this.getPrevPage() ?? 0
    }
    if (store.sprintMode === 'free')
      page = this.getRandomPage()

    this.pages.push(page)
    console.log(page)
    return page
  }

  private getPrevPage() {
    const currentPage = this.getCurrentPage()
    if (currentPage === null) {
      const { page } = store.textbook.getState()
      return page
    }
    if (currentPage > 0) return currentPage - 1
    if (currentPage === 0) {
      this.element &&
        new Notification({
          message: 'Недостаточно слов',
          duration: 6000
        }).show();
      this.onGameOver()
    }
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

  private setScore() {
    this.subElements &&
      (this.subElements['sprint-score'].textContent = String(this.score))
  }

  async getWord() {

    if (Object.keys(this.answers).length === WORDS_ON_PAGE * (this.pages.length)) {
      this.getPage()
      this.timer.pause()
      await withLouding(this.getData())
      this.timer.start()
    }

    while (true) {
      const { word, wordTranslate, id, audio } = this.data[getRandomInt(0, WORDS_ON_PAGE)]

      if (!Object.keys(this.answers).includes(id, (WORDS_ON_PAGE * (this.pages.length - 1)))) {
        return { word, wordTranslate, id, audio }
      }
    }
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

  private getRandomTranslate() {

    while (true) {
      const { wordTranslate, id } = this.data[getRandomInt(0, WORDS_ON_PAGE)]
      if (this.currentWordId !== id) {
        return wordTranslate
      }
    }
  }

  async getRound() {

    this.isTrue = Boolean(getRandomInt(0, 2))

    const { word, wordTranslate, id, audio } = await this.getWord()
    this.currentWordId = id;
    this.audio = new Audio(`${BASE}${audio}`)
    const translate = this.isTrue ? wordTranslate : this.getRandomTranslate()

    if (this.subElements) {
      this.subElements['sprint-word'].textContent = word
      this.subElements['sprint-translate'].textContent = translate
    }
  }

  render() {
    super.render(template())
    this.initGame()
    this.setScore()
    const timer = this.timer.render()
    this.element && timer && this.element.append(timer)
    this.initEventListeners()
    return this.element
  }

  ok() {
    if (store.sprintSound) {
      this.sound.src = 'assets/sounds/ok.wav';
      this.sound.play();
    }
  }

  error() {
    if (store.sprintSound) {
      this.sound.src = 'assets/sounds/error.wav';
      this.sound.play();
    }
  }

  private initEventListeners(): void {

    if (this.subElements) {
      this.subElements['sprint-button'].addEventListener('click', this.onClick as unknown as EventListener)
      this.subElements['sprint-sound'].addEventListener('click', this.onSoundClick as unknown as EventListener)
      this.subElements['sprint-audio'].addEventListener('click', this.onAudioClick as unknown as EventListener)
      //sprint-audio
    }
    this.timer.element &&
      this.timer.element.addEventListener('timer-over', this.onGameOver as unknown as EventListener)

    this.element &&
      window.addEventListener('keydown', this.onKeyDown as unknown as EventListener)

  }


}