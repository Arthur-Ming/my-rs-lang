import { IAsyncComponent, IComponent } from "../interfaces";
export default function renderPage({
  from,
  to,
  duration = 300
}: {
  from: IAsyncComponent | IComponent | null,
  to: Element | null,
  duration?: number
}): void {

  const content: HTMLElement | null = document.getElementById('content');

  if (!content) return
  document.body.classList.add('main_fd');
  document.body.classList.add('_lock');

  setTimeout(() => {
    content.innerHTML = '';

    if (from && from.destroy) { from.destroy(); }

    to && content.append(to);
    document.body.classList.remove('_lock');
    document.body.classList.remove('main_fd');

  }, duration);
}