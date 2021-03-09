import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadJsService {

  constructor() { }

  public loadSalesOrder() {      
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
          isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = [
        "../../assets/js/date/date.js",
      ];
      // console.log(document.getElementsByTagName('body')[0])
      for (var i = 0; i < dynamicScripts.length; i++) {
          let node = document.createElement('script');
          node.src = dynamicScripts [i];
          node.type = 'text/javascript';
          node.async = false;
          node.charset = 'utf-8';
          document.getElementsByTagName('body')[0].appendChild(node);
      }
    }
  }

  public loadAlert() {      
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
          isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = [
        "../../assets/js/alert.js",
      ];
      // console.log(document.getElementsByTagName('body')[0])
      for (var i = 0; i < dynamicScripts.length; i++) {
          let node = document.createElement('script');
          node.src = dynamicScripts [i];
          node.type = 'text/javascript';
          node.async = false;
          node.charset = 'utf-8';
          document.getElementsByTagName('body')[0].appendChild(node);
      }
    }
  }

}
