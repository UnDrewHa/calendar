//= helpers.js
//= store.js
//= model.js
//= template.js
//= view.js
//= controller.js

(function () {
  function Calendar(name) {
    this.storage = new app.Store(name);
    this.model = new app.Model(this.storage);
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.model, this.view);
  }
  
  var calendar = new Calendar('new-calendar');
  
  function setView() {
    calendar.controller.startView();
  }

  $on(window, 'load', setView);
}());