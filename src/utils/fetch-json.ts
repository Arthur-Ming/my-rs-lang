// same as fetch, but throws FetchError in case of errors
// status >= 400 is an error
// network error / json error are errors

export default async function (url: string, params?: RequestInit) {
  let response;

  try {

    response = await fetch(url, params);

  } catch (err) {
    throw new FetchError(response, "Network error has occurred.");
  }

  let body;

  if (!response.ok) {
    console.log('!!!!')
    let errorText = response.statusText; // Not Found (for 404)


    try {
      body = await response.json();

      errorText = (body.error && body.error.message) || (body.data && body.data.error && body.data.error.message) || errorText;
    } catch (error) { /* ignore failed body */ }

    const message = `Error ${response.status}: ${errorText}`;

    throw new FetchError(response, body, message);
  }

  try {
    return await response.json();
  } catch (e: unknown) {

    const error = e as Error
    throw new FetchError(response, null, error.message);
  }
}

export class FetchError extends Error {
  name = "FetchError";
  response
  body

  constructor(response: Response | undefined, body: string | null, message = '') {
    super(message);
    this.response = response;
    this.body = body;
    console.log('FetchError')
  }
}

// handle uncaught failed fetch through
window.addEventListener('unhandledrejection', event => {
  if (event.reason instanceof FetchError) {
    // throw Error('ggfffg')
    alert(event.reason.message);
  }
});
