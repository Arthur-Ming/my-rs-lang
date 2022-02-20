import Component from "../../../core/component";

const template = (message: string): string => `
<div class="show-score show-score_success">
  <div class="show-score__wrapper">
    <div class="show-score__header _hidden"></div>
    <div class="show-score__body">${message}</div>
  </div>
</div>
`;

type NotificationParams = {
  message: string,
  type?: string,
  duration?: number
}

export default class ShowScore extends Component {

  static staticElement: Element | null = null;
  private params: NotificationParams;

  constructor({
    message,
    type = 'success',
    duration = 2000,
  }: NotificationParams) {

    super()
    this.params = {
      type,
      message,
      duration
    }

    this.render();
  }

  render(): Element | null {
    super.render(template(this.params.message))
    return this.element;
  }

  show(elem = document.body): void {
    if (ShowScore.staticElement) {
      ShowScore.staticElement.remove();
    }

    ShowScore.staticElement = this.element;

    if (this.element)
      elem.append(this.element);

    setTimeout(() => {
      if (this.element)
        this.element.classList.add('show-score_show');
    }, 0);

    setTimeout(() => {
      if (this.element)
        this.element.classList.remove('show-score_show');
    }, this.params.duration ? this.params.duration / 2 : 0);

    setTimeout(() => {
      this.destroy();
    }, this.params.duration);
  }
}