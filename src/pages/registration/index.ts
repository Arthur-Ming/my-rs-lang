import Component from "../../core/component";
import Router from "../../router";
import httpClient from "../../api/httpClient";
import { validateEmail, validateName, validatePassword } from "../../utils/validate";

const template = () => `
<div class="login">
  <div class="login__content login__content_reg wrapper__box">
    <h4 class="login__title">Регистрация</h4>
    <form class="login__forms">
      <div class="login__form">
        <label class="login__label" for="input1">Email</label>
        <div class="login__input">
          <input name="email" type="email" id="input1" data-element='reg-email' 
            required  placeholder="E-mail" autofocus>
          <span class="login__err" data-element='email-err'></span>
        </div>
      </div>
      <div class="login__form">
        <label class="login__label" for="input3">Имя</label>
        <div class="login__input">
          <input type="text" data-element='reg-user-name' id="input3">
          <span class="login__err" data-element='name-err'></span>
        </div>
      </div>
      <div class="login__form">
        <label class="login__label" for="input2">Пароль</label>
        <div class="login__input">
          <input type="password" data-element='reg-password' id="input2">
          <span class="login__err" data-element='pass-err'></span>
        </div>
      </div>
      <button class="login__button button" data-element='reg-submit'><span>Зарегистрироваться</span></button>
      <div class="login__append">
        <span>Уже есть аккаунт? </span>
        <span class="login__reg" data-element='reg-login'>Войдите</span>
      </div>
    </form>
  </div>
</div>
`
const router = Router.getInstance()

export default class Registration extends Component {

  password: string = ''
  email: string = ''
  name: string = ''

  onLogin = () => {
    console.log('login')
    router.route({ to: 'login' })
  }

  onEmailInput = (event: { target: { value: string; }; }) => {
    this.email = event.target.value.trim()
    this.subElements && (this.subElements['email-err'].textContent = '')
  }

  onPasswordInput = (event: { target: { value: string; }; }) => {
    this.password = event.target.value.trim()
    this.subElements && (this.subElements['pass-err'].textContent = '')
  }

  onNameInput = (event: { target: { value: string; }; }) => {
    this.name = event.target.value.trim()
    this.subElements && (this.subElements['name-err'].textContent = '')
  }

  onSubmit = async (event: { preventDefault: Function }) => {

    event.preventDefault()

    if (!validateEmail(this.email)) {
      this.subElements && (this.subElements['email-err'].textContent = 'не валидный email')
      return
    }

    if (!validateName(this.name)) {
      this.subElements && (this.subElements['name-err'].textContent = 'поле обязательно для заполнения')
      return
    }

    if (!validatePassword(this.password)) {
      this.subElements && (this.subElements['pass-err'].textContent = 'должно быть не менее 8 символов')
      return
    }


    const res = await httpClient.createUser({
      email: this.email,
      password: this.password,
      name: this.name
    })

    console.log(res)
    /*{
    "id": "620dfd8e7251550015a21069",
    "name": "art",
    "email": "arthurming7@gmail.com"
    }
    */
  }

  render() {
    super.render(template())
    this.initEventListeners()
    return this.element
  }

  private initEventListeners(): void {

    if (this.subElements && this.subElements['reg-login']) {
      this.subElements['reg-login'].addEventListener('click', this.onLogin as unknown as EventListener)
    }
    if (this.subElements && this.subElements['reg-email']) {
      this.subElements['reg-email'].addEventListener('input', this.onEmailInput as unknown as EventListener)
    }
    if (this.subElements && this.subElements['reg-password']) {
      this.subElements['reg-password'].addEventListener('input', this.onPasswordInput as unknown as EventListener)
    }
    if (this.subElements && this.subElements['reg-submit']) {
      this.subElements['reg-submit'].addEventListener('click', this.onSubmit as unknown as EventListener)
    }
    if (this.subElements && this.subElements['reg-user-name']) {
      this.subElements['reg-user-name'].addEventListener('input', this.onNameInput as unknown as EventListener)
    }
    //reg-user-name
  }
}