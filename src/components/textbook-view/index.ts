import Component from "../../core/component";
import { IComponent } from "../../interfaces";
import { CardType } from "../../types";
import { createElement } from "../../utils/domHelpers";
import TextbookCard from "./textbook-card";

export interface ITextbookView extends IComponent {
  updata(cards: CardType[]): void
}


const templete = () => `<div class="textbook__cards"></div>`

export default class TextbookView extends Component implements ITextbookView {

  cards: CardType[]

  constructor({ cards }: { cards: CardType[] }) {
    super()
    this.cards = cards
  }

  render() {
    super.render(templete())
    this.renderCards(this.cards)
    if (!this.cards.length) {
      this.element && this.element.append(createElement(`
      <span>Здесь пока пусто :-(</span>
      `))
    }
    return this.element
  }

  renderCards(cards: CardType[]) {
    cards.forEach((card) => {
      const element = (new TextbookCard({ card })).render()
      element && this.element && this.element.append(element)
    })
  }

  updata(cards: CardType[]): void {
    this.element && (this.element.innerHTML = '')
    this.cards = cards
    this.renderCards(cards)
  }
}