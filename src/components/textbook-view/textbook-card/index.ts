import { BASE } from "../../../api/httpClient";
import Component from "../../../core/component";
import { CardType } from "../../../types";
import store from "../../../store";
import { AUDIO_ACTIVE, AUDIO_DESACTIVE, HARD_WORD_SELECTED } from "../../../store/constants";

const DICTIONARY = 6

const template = (card: CardType) => {
  const {
    id,
    word,
    image,
    transcription,
    wordTranslate,
    textMeaning,
    textMeaningTranslate,
    textExample,
    textExampleTranslate
  } = card


  const isHard = store.dictionary.getState()[id]

  const isDictionary = (store.textbook.getState().group === DICTIONARY && store.isSignIn)

  return `
<div class="textbook-card 
     textbook-card_color-${store.textbook.getState().group + 1}
     ${isHard ? 'textbook-card_hard' : ''}
     " 
      data-card-id=${id}>
    <div class="textbook-card__icon">
      <img src="${BASE}${image}" alt=${word}>
    </div>
    <div class="textbook-card__text">
      <div class="textbook-card__header">
        <h4 class="textbook-card__word">${word}</h4><span> - </span>
        <h4 class="textbook-card__transcription">${transcription}</h4><span> - </span>
        <h4 class="textbook-card__word-translate">${wordTranslate}</h4>
      </div>
      <div class="textbook-card__body">
        <div class="textbook-card__meaning">
          <h5 class="textbook-card__text-meaning">${textMeaning}</h5>
          <h5 class="textbook-card__text-meaning">${textMeaningTranslate}</h5>
        </div>
        <div class="textbook-card__example">
          <h5 class="textbook-card__text-example">${textExample}</h5>
          <h5 class="textbook-card__text-example">${textExampleTranslate}</h5>
        </div>
      </div>
      <div class="textbook-card__buttons">
        <div class="textbook-card__select ${store.isSignIn ? '' : '_hidden'}">
          <button class="textbook-card__button button
          ${isDictionary ? '_hidden' : ''}
          " data-element='studied'>
            <span>Изученное</span>
          </button>
          <button class="textbook-card__button button 
                  ${isHard ? 'textbook-card__button_active' : ''}
                  ${isDictionary ? '_hidden' : ''}
                  " 
                  data-element='hard'>
            <span>Сложное</span>
          </button>
          <button class="textbook-card__button button 
          ${isDictionary ? '' : '_hidden'}
          "
          data-element='remove-card'>
             <span>Удалить</span>
          </button>
        </div>
        <div class="textbook-card__audio" data-element='audio'>
          <svg class="audio" viewBox="0 0 128 128">
            <use xlink:href='assets/svg/sprite.svg#audio' />
          </svg>
        </div>
    </div>
  </div>
</div>
`
}

export default class TextbookCard extends Component {

  private card: CardType
  private audio: HTMLAudioElement
  private isAudioActive = false

  onStudiedClick = () => {
    if (this.element) {
      this.element.classList.remove('textbook-card_hard')
      this.element.classList.toggle('textbook-card_studied')
    }
    if (this.subElements) {
      this.subElements?.studied.classList.toggle('textbook-card__button_active')
      this.subElements?.hard.classList.remove('textbook-card__button_active')
    }
  }

  onHardClick = () => {
    if (this.element) {
      this.element.classList.remove('textbook-card_studied')
      this.element.classList.toggle('textbook-card_hard')
    }
    if (this.subElements) {
      this.subElements?.hard.classList.toggle('textbook-card__button_active')
      this.subElements?.studied.classList.remove('textbook-card__button_active')
    }
    const isSelected = this.element && this.element.classList.contains('textbook-card_hard')
    store.dictionary.dispatch({
      type: HARD_WORD_SELECTED,
      wordId: this.card.id,
      isSelected
    })
  }

  onRemove = () => {
    store.dictionary.dispatch({
      type: HARD_WORD_SELECTED,
      wordId: this.card.id,
      isSelected: false
    })
    this.destroy()
  }

  constructor({ card }: { card: CardType }) {
    super()
    this.card = card
    this.audio = new Audio(`${BASE}${card.audio}`);
  }

  render() {
    super.render(template(this.card))
    this.initEventListeners()
    return this.element
  }

  toggleAudio = () => {
    if (this.isAudioActive) {
      this.isAudioActive = false
      this.audio.pause()
      this.audio.currentTime = 0
      this.subElements && this.subElements.audio.classList.remove('textbook-card__audio_active')
    }
  }

  onAudioClick = () => {
    if (this.isAudioActive) {
      this.toggleAudio()
      return
    }
    store.activeAudioCard.dispatch({
      type: AUDIO_ACTIVE,
      id: this.card.id
    })
    this.isAudioActive = true
    this.subElements && this.subElements.audio.classList.add('textbook-card__audio_active')
    this.audio = new Audio(`${BASE}${this.card.audio}`);
    this.audio.play()
    this.audio.addEventListener('ended', () => {
      this.audio = new Audio(`${BASE}${this.card.audioMeaning}`);
      this.audio.play()
      this.audio.addEventListener('ended', () => {
        this.audio = new Audio(`${BASE}${this.card.audioExample}`);
        this.audio.play()
        this.audio.addEventListener('ended', () => {
          this.audio = new Audio(`${BASE}${this.card.audio}`);
          this.isAudioActive = false
          store.activeAudioCard.dispatch({
            type: AUDIO_DESACTIVE,
          })
          this.subElements && this.subElements.audio.classList.remove('textbook-card__audio_active')
        });
      });
    });
  }

  private initEventListeners(): void {
    if (this.subElements) {
      this.subElements.audio &&
        this.subElements.audio.addEventListener('click', this.onAudioClick as unknown as EventListener);
      this.subElements.studied &&
        this.subElements.studied.addEventListener('click', this.onStudiedClick as unknown as EventListener);
      this.subElements.hard &&
        this.subElements.hard.addEventListener('click', this.onHardClick as unknown as EventListener);
      this.subElements['remove-card'] &&
        this.subElements['remove-card'].addEventListener('click', this.onRemove as unknown as EventListener);
    }

    store.activeAudioCard.subscribe(AUDIO_ACTIVE, this.toggleAudio)
  }
}