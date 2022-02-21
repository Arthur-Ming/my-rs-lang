import Component from "../../core/component";
import Router from "../../router";
import httpClient from "../../api/httpClient";
import Notification from "../../components/notification";
import { validateEmail, validatePassword } from "../../utils/validate";
import store from "../../store";
import { PAGE_CHANGE } from "../../store/constants";

const template = () => `
<div class="login">
  <div class="login__content wrapper__box">
    <h4 class="login__title">Вход</h4>
    <form class="login__forms" >
      <div class="login__form">
        <label class="login__label" for="input1">Email</label>
        <div class="login__input login__input_err">
          <input name="email" type="email" id="input1" data-element='login-email' 
          required  placeholder="E-mail" autofocus>
          <span class="login__err" data-element='email-err'></span>
        </div>
      </div>
      <div class="login__form">
        <label class="login__label" for="input2">Пароль</label>
        <div class="login__input">
          <input name="password"  type="password" data-element='login-password' 
          minlength="8"  placeholder="Пароль" id="input2">
          <span class="login__err" data-element='pass-err'></span>
        </div>
      </div>
      <button class="login__button button" type="submit" data-element='login-submit'><span>Войти</span></button>
      <div class="login__append">
        <span>Нет аккаунта?</span>
        <span class="login__reg"  data-element='login-reg'>Зарегистрируйтесь</span>
      </div>
    </form>
  </div>
</div>
`

const router = Router.getInstance()

export default class Login extends Component {

  password = ''
  email = ''

  onEmailInput = (event: { target: { value: string; }; }) => {
    this.email = event.target.value.trim()
    this.subElements && (this.subElements['email-err'].textContent = '')
    this.subElements && (this.subElements['pass-err'].textContent = '')
  }

  onPasswordInput = (event: { target: { value: string; }; }) => {
    this.password = event.target.value.trim()
    this.subElements && (this.subElements['pass-err'].textContent = '')
    this.subElements && (this.subElements['email-err'].textContent = '')
  }

  onSubmit = async (event: { preventDefault: Function }) => {
    event.preventDefault()

    if (!validateEmail(this.email)) {
      this.subElements && (this.subElements['email-err'].textContent = 'не валидный email')
      return
    }

    if (!validatePassword(this.password)) {
      this.subElements && (this.subElements['pass-err'].textContent = 'должно быть не менее 8 символов')
      return
    }

    try {
      const { token, refreshToken, userId, name } = await httpClient.signin({
        email: this.email,
        password: this.password
      })

      new Notification({
        message: 'Авторизация прошла успешно',
        duration: 3000
      }).show();

      store.currentPage.dispatch({
        type: PAGE_CHANGE,
        page: 'start'
      })

      store.userData = {
        token, refreshToken, userId, name
      }

      store.isSignIn = true
      location.reload()

    } catch (error) {

      this.subElements && (this.subElements['email-err'].textContent = 'не верный логин или пароль')
      new Notification({
        message: 'Авторизация не выполнена!',
        duration: 3000,
        type: 'error'
      }).show();
      store.isSignIn = false
    }
  }

  onReg = () => {

    router.route({ to: 'registration' })
  }

  render() {
    super.render(template())
    this.initEventListeners()
    return this.element
  }

  private initEventListeners(): void {

    if (this.subElements && this.subElements['login-email']) {
      this.subElements['login-email'].addEventListener('input', this.onEmailInput as unknown as EventListener)
    }
    if (this.subElements && this.subElements['login-password']) {
      this.subElements['login-password'].addEventListener('input', this.onPasswordInput as unknown as EventListener)
    }
    if (this.subElements && this.subElements['login-submit']) {
      this.subElements['login-submit'].addEventListener('click', this.onSubmit as unknown as EventListener)
    }
    if (this.subElements && this.subElements['login-reg']) {
      this.subElements['login-reg'].addEventListener('click', this.onReg as unknown as EventListener)
    }
  }
}