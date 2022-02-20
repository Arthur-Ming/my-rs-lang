export default function (img: string, word: string, translate: string) {
  return `
<div class="audio-call__show">
<div class="audio-call-show">
<div class="audio-call-show__icon">
  <img src="https://react-learnwords-example.herokuapp.com/${img}" alt="">
</div>
<div class="audio-call-show__text">
  <div class="audio-call-show__audio" data-audio-call-voice>
    <svg class="audio-call-show__audio-icon" viewBox="0 0 128 128">
      <use xlink:href='assets/svg/sprite.svg#audio' />
    </svg>
  </div>
  <div class="audio-call-show__word">${word}</div>
  <div class="audio-call-show__dash"></div>
  <div class="audio-call-show__translate">${translate}</div>
</div>
</div>
</div>
`;
}