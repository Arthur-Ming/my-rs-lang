import httpClient from "../../api/httpClient";
import Component from "../../core/component";
import { CardType } from "../../types";
import withLouding from "../../utils/withLouding";
import SprintResultsItems from "./sprint-results-items";

/* const getItem = ({word, translate, audio}) =>`
<li class="sprint-results__item sprint-results-item">
  <div class="sprint-results-item__audio">
    <svg class="audio" viewBox="0 0 128 128">
      <use xlink:href='assets/svg/sprite.svg#audio' />
    </svg>
  </div>
  <div class="sprint-results-item__word">Cat</div>
  <span class="sprint-results-item__dash"></span>
  <div class="sprint-results-item__translate">Кошка</div>
</li>
` */


const template = () => `
<div class="sprint-results" data-element='sprint-results'>
  <div class="sprint-results__content wrapper__box">
    <h5 class="sprint-results__title">Результаты</h5>
    <div class="sprint-results__column">
      <h5 class="sprint-results__subtitle">
        Ошибок <span class="sprint-results__errors" data-element='sprint-errors-amount'></span>
      </h5>
      <ul class="sprint-results__items" data-element='sprint-results-errors'></ul>
    </div>
    <div class="sprint-results__column">
      <h5 class="sprint-results__subtitle">
        Знаю <span class="sprint-results__success" data-element='sprint-success-amount'></span>
      </h5>
      <ul class="sprint-results__items" data-element='sprint-results-success'></ul>
    </div>
  </div>
</div>
`

export default class SprintResults extends Component {

  results: { [key: string]: boolean }


  constructor({
    results
  }: {
    results: {
      [key: string]: boolean
    }
  }) {
    super()
    this.results = results
  }

  private async init() {

    const data = await withLouding(this.getData())
    const { errors, success } = this.separateData(data)
    const errorsElem = this.subElements && this.subElements['sprint-results-errors']
    const successElem = this.subElements && this.subElements['sprint-results-success']
    if (errorsElem) this.renderItems(errors, errorsElem)
    if (successElem) this.renderItems(success, successElem)
    this.setErrorsAmount(errors)
    this.setSuccessAmount(success)
  }

  private async getData() {
    const data = await Promise.all(Object.keys(this.results).map(id => httpClient.getWord({ id })))
    return data
  }

  private separateData(data: CardType[]) {
    return {
      success: data.filter(({ id }) => this.results[id]),
      errors: data.filter(({ id }) => !(this.results[id]))
    }
  }

  private setErrorsAmount(data: CardType[]) {
    this.subElements &&
      (this.subElements['sprint-errors-amount'].textContent = String(data.length))
  }

  private setSuccessAmount(data: CardType[]) {
    this.subElements &&
      (this.subElements['sprint-success-amount'].textContent = String(data.length))
  }

  private renderItems(items: CardType[], elem: HTMLElement): void {
    items.forEach(({ word, wordTranslate, audio }) => {
      const element = (new SprintResultsItems({
        word,
        audio,
        translate: wordTranslate
      })).render()
      if (element) elem.append(element)
    })
  }

  render() {
    super.render(template())
    this.init()
    return this.element
  }
}