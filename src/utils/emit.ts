type CustomEventParams = {
  event: string,
  elem: Element | null,
  payload?: string | object | Element | null
}

export default function (params: CustomEventParams, isBubbles = false): void {
  if (params.elem)
    params.elem.dispatchEvent(new CustomEvent(params.event, { bubbles: isBubbles, detail: params.payload }));
}