import Component from '../../core/component';
import { IComponent } from '../../interfaces';

const template = (message: string, type = 'success'): string => `
<div class="notification notification_${type}">
  <div class="notification__wrapper">
    <div class="notification__header _hidden"></div>
    <div class="notification__body">${message}</div>
  </div>
</div>
`;

type NotificationParams = {
  message: string,
  type?: string,
  duration?: number
}

export interface INotification extends IComponent {
  show(elem: HTMLElement): void
}

export default class Notification extends Component implements INotification {

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
    super.render(template(this.params.message, this.params.type))
    return this.element;
  }

  show(elem = document.body): void {
    if (Notification.staticElement) {
      Notification.staticElement.remove();
    }

    Notification.staticElement = this.element;

    if (this.element)
      elem.append(this.element);

    setTimeout(() => {
      if (this.element)
        this.element.classList.add('notification_show');
    }, 0);

    setTimeout(() => {
      if (this.element)
        this.element.classList.remove('notification_show');
    }, this.params.duration ? this.params.duration / 2 : 0);

    setTimeout(() => {
      this.destroy();
    }, this.params.duration);
  }
}