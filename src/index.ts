import './scss/app.scss';
import App from './App';
import tooltip from './components/tooltip';


//import httpClient from './api/httpClient';
//localStorage.clear()

const app = new App()



const root: HTMLElement | null = document.getElementById('app')

if (root) {

  const element = app.render()
  element && root.append(element)
}




tooltip.initialize();

