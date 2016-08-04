(function(window) {
  "use strict";

  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;
    this._date = new Date();

    self.view.bind('nextMonth', function () {
      self.nextMonth();
    });
    self.view.bind('prevMonth', function () {
      self.prevMonth();
    });
    self.view.bind('showDayNotes', function (date) {
      self.showDayNotes(date);
    });
    self.view.bind('removeItem', function (id) {
      self.removeItem(id);
    });
    self.view.bind('toggleItem', function (item) {
      self.toggleItem(item.id, item.completed);
    });
    self.view.bind('addNote', function (data) {
      self.addNote(data);
    });
  }

  Controller.prototype.startView = function() {
    var self = this;
    self.view.render('showCalendar', {year: this._date.getFullYear(), month: this._date.getMonth()});
    self.model.getCount(function(notes) {
      self.view.render('updateCount', notes);
    });
    self.model.find({year: this._date.getFullYear(), month: this._date.getMonth()}, function(dots) {
      self.view.render('showEntries', dots);
    });
  };

  Controller.prototype.nextMonth = function() {
    var self = this;
    console.log(this._date);
    this._date.setMonth(this._date.getMonth() + 1);
    console.log(this._date);
    self.view.render('showCalendar', {year: this._date.getFullYear(), month: this._date.getMonth()});
    self.model.find({year: this._date.getFullYear(), month: this._date.getMonth()}, function(dots) {
      self.view.render('showEntries', dots);
    });
  };
  Controller.prototype.prevMonth = function() {
    var self = this;
    this._date.setMonth(this._date.getMonth() - 1);
    self.view.render('showCalendar', {year: this._date.getFullYear(), month: this._date.getMonth()});
    self.model.find({year: this._date.getFullYear(), month: this._date.getMonth()}, function(dots) {
      self.view.render('showEntries', dots);
    });
  };
  Controller.prototype.removeItem = function(id) {
    var self = this;
    self.model.remove(id, function() {
      self.view.render('removeItem', id);
    });
    self.model.getCount(function(notes) {
      self.view.render('updateCount', notes);
    });
  };
  Controller.prototype.toggleItem = function(id, completed) {
    var self = this;
    self.model.update({completed: +completed}, function() {
      self.view.render('toggleItem', {id: +id, completed: +completed});
    }, id);
    self.model.getCount(function(notes) {
      self.view.render('updateCount', notes);
    });
  };
  Controller.prototype.addNote = function(data) {
    var self = this;
    if (data.id) {
      var id = data.id;
      delete data.id;
      self.model.update(data, function() {
        self.view.render('addNote');
      }, id);
    }
    else {
      self.model.create(data, function() {
        self.view.render('addNote');
      });
      self.model.getCount(function(notes) {
        self.view.render('updateCount', notes);
      });
    }

  };
  Controller.prototype.updateNote = function(data) {
    var self = this;
    
  };

  

  Controller.prototype.showDayNotes = function(date) {
    var self = this;
    if (!date) {
      return;
    }

    var n = date.lastIndexOf("-"),
        y = date.substr(0, 4),
        m = date.slice(5, n),
        d = date.slice(n+1, date.length),
        currentDate = new Date(y,m,d);
        
    self.model.find({year: parseInt(y, 10), month: parseInt(m, 10), day: parseInt(d, 10) }, function(notes) {
      self.view.render('showDayNotes', notes);
    });
    self.view.render('showDayTitle', {day: d, month: m, dayName: currentDate.getDay()});
  };


  window.app = window.app || {};
  window.app.Controller = Controller;
}(window));