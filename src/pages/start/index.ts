import Component from "../../core/component";

const template = () => `
<div class="start">
<div class="start__content wrapper__box">
     <section class="peculiarities">
        <div class="peculiarities__content">
            <h2 class="start__subtitle">возможности и преимущества</h2>
            <div class="peculiarities__items">
                <div class="peculiarities__item">
                    <svg class="peculiarities__icon" viewBox="0 0 1000 1000">
                        <use xlink:href='assets/svg/sprite.svg#mess' />
                    </svg>
                    <div class="peculiarities__text">
                        Наша миссия — сделать обучение английскому языку доступным для каждого.
                    </div>
                </div>
                <div class="peculiarities__item">
                    <svg class="peculiarities__icon" viewBox="0 0 1000 1000">
                        <use xlink:href='assets/svg/sprite.svg#textbook' />
                    </svg>
                    <div class="peculiarities__text">
                        Учебник содержит 3600 часто употребляемых английских слов, примеры использования
                        изучаемого слова, а также их голосовое произношение.
                    </div>
                </div>
                <div class="peculiarities__item">
                    <svg class="peculiarities__icon" viewBox="0 0 1000 1000">
                        <use xlink:href='assets/svg/sprite.svg#game' />
                    </svg>
                    <div class="peculiarities__text">
                        Использование игр, помогает снять усталость и напряжение, повышает мотивацию к
                        изучению языка, позволяет создать ситуации общения.
                    </div>
                </div>
                <div class="peculiarities__item">
                    <svg class="peculiarities__icon" viewBox="0 0 1000 1000">
                        <use xlink:href='assets/svg/sprite.svg#statistics' />
                    </svg>
                    <div class="peculiarities__text">
                        Возможность наблюдать динамику результатов. Ощущение прогресса помогает
                        мотивировать
                        себя на новые свершения.
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="team">
        <h2 class="start__subtitle">наша команда</h2>
        <div class="team__content wrapper_box">
            <div class="team__items">
                <div class="team__item team-item">
                    <div class="team-item__icon"></div>
                    <div class="team-item__text">
                        Разработал архитектуру и дизайн приложения,
                        игры Аудиовызов и Спринт, учебник,
                        настроил аутентификацию.
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
</div>
`

export default class Start extends Component {
    render() {
        super.render(template())
        return this.element
    }

}