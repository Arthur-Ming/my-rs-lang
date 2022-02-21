import { IComponent, IPortal } from "../../interfaces";

export default class Portal implements IPortal {

  static _instance: Portal | null
  private components: Map<string, IComponent> = new Map()

  static instance(): Portal {
    if (!this._instance) {
      this._instance = new Portal();
    }
    return this._instance;
  }

  getComponent(name: string): IComponent | undefined {

    return this.components.get(name)
  }

  setComponent(name: string, instance: IComponent): IPortal {
    this.components.set(name, instance)
    return this
  }
}