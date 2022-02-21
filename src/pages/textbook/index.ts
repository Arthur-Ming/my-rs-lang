import TextbookView, { ITextbookView } from "../../components/textbook-view";
import Component from "../../core/component";
import { IComponent } from "../../interfaces";
import Pagination from "../../components/pagination";
import Groups, { IGroups } from "../../components/groups";
import store from "../../store";
import { GROUP_SELECT, PAGE_DOUBLENEXT, PAGE_DOUBLEPREV, PAGE_NEXT, PAGE_PREV } from "../../store/constants";
import httpClient from "../../api/httpClient";

const DICTIONARY = 6

const templete = () => `
<div class="textbook">
  <div class="textbook__header wrapper__box">
    <div class="groups" data-element='groups'></div>
    <button class="textbook__dictionary-button 
            ${(store.textbook.getState().group === DICTIONARY) ?
    'textbook__dictionary-button_active' : ''}
            button ${store.isSignIn ? '' : '_hidden'}" 
            data-element='dictionary'>
      <span>Сложные слова</span>
    </button>  
  </div>
  <div class="textbook__content wrapper__box" data-element='textbook-view'></div>
  <div class="pagination ${(store.textbook.getState().group === DICTIONARY) ? '_hidden' : ''}" 
       data-element='pagination'></div>
</div>
`
export default class Textbook extends Component implements IComponent {

  private components!: {
    [componentName: string]: IComponent
    'textbook-view': ITextbookView,
    groups: IGroups
  };

  onGroupSelect = () => {
    const { group } = store.textbook.getState()
    if (group === DICTIONARY) {
      this.subElements && this.subElements.pagination &&
        this.subElements.pagination.classList.add('_hidden');
      this.subElements && this.subElements.dictionary.classList.add('textbook__dictionary-button_active')

    } else {
      this.subElements && this.subElements.pagination &&
        this.subElements.pagination.classList.remove('_hidden');
      this.subElements && this.subElements.dictionary.classList.remove('textbook__dictionary-button_active')
    }
    this.update()
  }

  onDictionaryClick = () => {
    store.textbook.dispatch({
      type: GROUP_SELECT,
      group: DICTIONARY
    })
    this.components.groups.removeActive()
    this.update()
  }

  async initComponents() {

    const data = await this.getData()

    this.components = {
      'textbook-view': new TextbookView({ cards: data }),
      pagination: new Pagination(),
      groups: new Groups()
    }
    super.renderComponents(this.components)
    this.initEventListeners()

  }
  render() {
    super.render(templete())
    this.initComponents()
    return this.element
  }

  async getData() {

    const { page, group } = store.textbook.getState()

    if (group === DICTIONARY) {
      console.log('gic')
      const dictionaryWords = store.dictionary.getState()
      const data = await Promise.all(
        Object.keys(dictionaryWords)
          .filter(id => dictionaryWords[id])
          .map(id => httpClient.getWord({ id })))

      return data

    }

    const data = await httpClient.getWords({ page: page, group: group })
    return data
  }

  update = async () => {
    const data = await this.getData()
    this.components['textbook-view'].updata(data)
  }

  private initEventListeners(): void {
    store.textbook.subscribe(PAGE_NEXT, this.update)
    store.textbook.subscribe(PAGE_PREV, this.update)
    store.textbook.subscribe(PAGE_DOUBLENEXT, this.update)
    store.textbook.subscribe(PAGE_DOUBLEPREV, this.update)
    store.textbook.subscribe(GROUP_SELECT, this.onGroupSelect)
    if (this.subElements) {
      this.subElements.dictionary.addEventListener('click', this.onDictionaryClick as unknown as EventListener)
    }
  }
}