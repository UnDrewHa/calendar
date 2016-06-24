(function(window) {
  'use strict';

    function Store(name, callback) {
      callback = callback || function() {};

      this._dbname = name;

      if (!localStorage[name]) {
        var data = {
          notes: [
            { id: 1238,
              title: 'Main note',
              year: 2016,
              month: 5,
              day: 13,
              hours: 15,
              minutes: 30,
              completed: 0
            },
            { id: 7865,
              title: 'Another test note',
              year: 2016,
              month: 5,
              day: 20,
              hours: 10,
              minutes: 45,
              completed: 1
            },
            { id: 7865,
              title: 'Test note',
              year: 2016,
              month: 5,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 1
            },
            { id: 7865,
              title: 'Test note',
              year: 2016,
              month: 6,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 0
            },
            { id: 7865,
              title: 'Test note',
              year: 2016,
              month: 6,
              day: 22,
              hours: 12,
              minutes: 12,
              completed: 1
            }
          ]
        };

        localStorage[name] = JSON.stringify(data);
        callback.call(this, JSON.parse(localStorage[name]));
      }
    }

    Store.prototype.find = function (query, callback) {
      if (!callback) {
        return;
      }

      var notes = JSON.parse(localStorage[this._dbname]).notes;

      callback.call(this, notes.filter(function(note) {
        for (var q in query) {
          if ( query[q] !== note[q]) {
            return false;
          }
        }
        return true;
      }));
    };

    Store.prototype.findAll = function(callback) {
      callback = callback || function() {};
      callback.call(this, JSON.parse(localStorage[this._dbname]).notes);
    };

    Store.prototype.save = function(updateData, callback, id) {
      callback = callback || function() {};

      var data = JSON.parse(localStorage[this._dbname]),
          notes = data.notes;

      if (id) {
        for (var i = 0; i < notes.length; i++) {
          if (notes[i].id === id) {
            for (var key in updateData) {
              notes[i][key] = updateData[key];
            }
            break;
          }
        }
        localStorage[this._dbname] = JSON.parse(data);
        callback.call(this, JSON.parse(localStorage[this._dbname]).notes);
      }
      else {
        updateData.id = new Date().getTime();
        notes.push(updateData);

        localStorage[this._dbname] = JSON.stringify(data);
        callback.call(this, [updateData]);
      }
    };

    Store.prototype.remove = function(id, callback) {
      callback = callback || function() {};

      var data = JSON.parse(localStorage[this._dbname]),
          notes = data.notes;

      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
          notes.splice(i, 1);
          break;
        }
      }

      localStorage[this._dbname] = JSON.stringify(data);
      callback.call(this, JSON.parse(localStorage[this._dbname]).notes);
    };

    Store.prototype.drop = function(callback) {
      callback = callback || function() {};

      localStorage[this._dbname] = JSON.stringify({ notes: []});
      callback.call(this, JSON.parse(localStorage[this._dbname]).notes);
    };

  window.app = window.app || {};
  window.app.Store = Store;
}(window));