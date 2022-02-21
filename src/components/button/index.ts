import Component from "../../core/component";
import { IComponent } from "../../interfaces";

const template = (title: string): string => `
<button class="button">
  <span>${title}</span>
</button>
`;

export default class Button extends Component implements IComponent {

  title: string

  constructor({ title }: { title: string }) {
    super()
    this.title = title
  }

  render(): Element | null {
    super.render(template(this.title))
    return this.element;
  }
}
