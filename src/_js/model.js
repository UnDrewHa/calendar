(function(window) {
  "use strict";

  function Model(storage) {
    this.storage = storage;
  }

  Model.prototype.create = function(data, callback) {
    this.storage.save(data, callback);
  };

  Model.prototype.find = function(query, callback) {
    var queryType = typeof query;

    if (queryType === 'function') {
      callback = query;
      this.storage.findAll(callback);
    }
    else if (queryType === 'string' || queryType === 'number') {
      query = parseInt(query, 10);
      this.storage.find({id: query}, callback);
    }
    else {
      this.storage.find(query, callback);
    }
  };

  Model.prototype.update = function(data, callback, id) {
    this.storage.save(data, callback, id);
  };

  Model.prototype.remove = function(id, callback) {
    this.storage.remove(id, callback);
  };

  Model.prototype.removeAll = function(callback) {
    this.storage.drop(callback);
  };

  Model.prototype.getCount = function(callback) {
    var notes = {
      active: 0,
      completed: 0,
      total: 0
    };

    this.storage.findAll(function(data) {
      data.forEach(function(note) {
        if (note.completed) {
          notes.completed++;
        }
        else {
          notes.active++;
        }
        notes.total++;
      });
      callback(notes);
    });
  };

  window.app = window.app || {};
  window.app.Model = Model;
}(window));