import Component from "../../core/component";
import { IComponent } from "../../interfaces";
import Auth from "../auth";
import Logo from "../logo";
import Nav from "../nav";
import HeaderAdaptive from "./header-adaptive";

const template = () => `
<div class="header__content wrapper__box">
    <div class="header__logo" data-element='logo'></div>
    <div class="header__list" data-element='list'>
   
      <nav class="header__nav nav" data-element='nav'></nav>
      <div class="header__auth" data-element='auth'></div>
    </div>
</div>
 `

export default class Header extends Component {

    private components!: {
        [componentName: string]: IComponent
    };

    initComponents() {

        this.components = {
            logo: new Logo(),
            nav: new Nav(),
            auth: new Auth()
        }

        super.renderComponents(this.components)
    }

    render() {
        super.render(template())
        this.initComponents()
        new HeaderAdaptive(this)
        return this.element
    }
}