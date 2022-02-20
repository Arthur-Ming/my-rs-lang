import { IComponent } from "../../interfaces";
import { SubElements } from "../../types";
import { getSubElements } from "../../utils/domHelpers";


export default abstract class Component {

  element: Element | null = null
  subElements: SubElements;

  render(template: string): void {

    const element: Element = document.createElement('div');
    element.innerHTML = template;
    this.element = element.firstElementChild;
    this.subElements = getSubElements(this.element);
  }

  renderComponents(components: { [key: string]: IComponent }): void {
    Object.entries(components)
      .forEach(([name, component]: [string, IComponent]) => {
        if (this.subElements) {
          const element = component.render()
          element && this.subElements[name].append(element);
        }
      })
  }

  remove(): void {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy(): void {
    this.remove();
    this.element = null;
  }
}