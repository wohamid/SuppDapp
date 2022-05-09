import {CONFIG_KEY} from './shared.js'


function main(config, body){
  console.log('hello', config.projectName,'!')

  // TODO: to make sure our CSS is not affected by the main site, we either render to an iframe or use a web component for a wrapper.
  // Using a web conmponent could be nice, because we'd add type=module to the script tag we generate and use native features then. The customer can decide where they want the <supdapp> tag inserted. 
}
main(window[CONFIG_KEY], document.body)