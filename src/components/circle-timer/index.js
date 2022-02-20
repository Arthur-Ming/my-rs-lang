import Component from "../../core/component";
import emit from "../../utils/emit";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 30;
const ALERT_THRESHOLD = 15;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let remainingPathColor = COLOR_CODES.info.color;

const template = (formatTime) => `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path data-element='base-timer-path-remaining' stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
         d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></path>
    </g>
  </svg>
  <span data-element='base-timer-label' class="base-timer__label">${formatTime}</span>
</div>
`


export default class CircleTimer extends Component {

  timerInterval = null
  timePassed = 0

  constructor({
    duration = 60,
  } = {}) {
    super()
    this.duration = duration;
    this.timeLeft = duration;
  }

  render() {
    super.render(template(this.formatTime(this.timeLeft)))
    return this.element
  }

  onTimesUp() {
    clearInterval(this.timerInterval);
    emit({
      elem: this.element,
      event: 'timer-over'
    })
  }

  start() {
    this.timerInterval = setInterval(() => {
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.duration - this.timePassed;
      this.subElements['base-timer-label'].textContent = this.formatTime(
        this.timeLeft
      );

      this.setCircleDasharray();
      this.setRemainingPathColor(this.timeLeft);

      if (this.timeLeft === 0) {
        this.onTimesUp();
      }
    }, 1000);
    return this;
  }

  pause() {
    clearInterval(this.timerInterval);
    return this
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      this.subElements['base-timer-path-remaining'].classList.remove(warning.color);
      this.subElements['base-timer-path-remaining'].classList.add(alert.color);

    } else if (timeLeft <= warning.threshold) {
      this.subElements['base-timer-path-remaining'].classList.remove(info.color);
      this.subElements['base-timer-path-remaining'].classList.add(warning.color);

    }
  }

  calculateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.duration;
    return rawTimeFraction - (1 / this.duration) * (1 - rawTimeFraction);
  }

  setCircleDasharray() {
    const circleDasharray = `${(this.calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
    this.subElements['base-timer-path-remaining'].setAttribute("stroke-dasharray", circleDasharray);

  }


}