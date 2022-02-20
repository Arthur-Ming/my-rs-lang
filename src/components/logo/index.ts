import Component from "../../core/component";
import Router from "../../router";
import store from "../../store";

const template = () => `
<div class="logo">rs lang</div>
`
const router = Router.getInstance()

export default class Logo extends Component {

  onClick = () => {

    router.route({ to: 'start' })
  }

  render() {
    super.render(template())
    this.initEventListeners()
    return this.element
  }

  private initEventListeners(): void {
    this.element && this.element.addEventListener('click', this.onClick as unknown as EventListener)
  }
}