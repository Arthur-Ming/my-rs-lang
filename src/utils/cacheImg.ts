export default function cacheImg(paths: string[]): Promise<void[]> {

  const promises = paths.map((path: string) => {
    const img: HTMLImageElement = document.createElement('img');
    img.src = path;

    return new Promise<void>((resolve: Function): void => {
      img.onload = () => resolve();
    });
  });

  return Promise.all(promises);
}