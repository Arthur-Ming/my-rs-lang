import { SubElements } from "../types";

export interface IComponent {
  element: Element | null;
  subElements: SubElements;
  render(): Element | null;
  destroy(): void
}

export interface IAsyncComponent {
  element: Element | null;
  render(): Promise<Element | null>;
  destroy(): void
}

export interface IPortal {
  setComponent(name: string, instance: IComponent): IPortal
  getComponent(name: string): IComponent | undefined
}



