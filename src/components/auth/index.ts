import Component from "../../core/component";
import Router from "../../router";
import Notification from "../notification";
import store from "../../store";

const template = () => `
<div class="auth">
  <span class="auth__auth ${store.isSignIn ? '_hidden' : ''} ">Войти</span>
  <span class="auth__auth ${store.isSignIn ? '' : '_hidden'}" 
  data-tooltip='выйти'>${store.userData.name}</span>
  <svg class="auth__icon" viewBox="0 0 24 24">
     <use xlink:href='assets/svg/sprite.svg#auth' />
  </svg>
</div>
`

const router = Router.getInstance()

export default class Auth extends Component {

  onClick = () => {
    if (store.isSignIn) {
      store.isSignIn = false
      new Notification({
        message: 'Пользователь покинул аккаунт',
        duration: 3000
      }).show();
      location.reload()
    } else {
      router.route({
        to: 'login'
      })
    }
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