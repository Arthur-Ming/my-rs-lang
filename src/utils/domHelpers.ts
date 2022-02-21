import { SubElements } from "../types";

export function getSubElements(element: Element | null, name = '[data-element]', el = 'element'): SubElements {

  if (!element) return

  const elements: NodeListOf<HTMLElement> = element.querySelectorAll(name);

  return [...elements].reduce((result: SubElements = {}, item: HTMLElement) => {
    const key = item.dataset[el]

    if (key)
      result[key] = item;

    return result;
  }, {});
}


export function createElement(template: string, tag = 'div'): Element {

  const element: Element = document.createElement(tag);

  element.innerHTML = template;

  if (element.firstElementChild)
    return element.firstElementChild;
  else
    throw Error('Template is not correct')
}
