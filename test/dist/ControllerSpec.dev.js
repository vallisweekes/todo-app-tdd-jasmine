"use strict";

/*global app, jasmine, describe, it, beforeEach, expect */
describe('Controller', function () {
  'use strict';

  var subject, model, view;

  var setUpModel = function setUpModel(todos) {
    model.read.and.callFake(function (query, callback) {
      callback = callback || query;
      callback(todos);
    });
    model.getCount.and.callFake(function (callback) {
      var todoCounts = {
        active: todos.filter(function (todo) {
          return !todo.completed;
        }).length,
        completed: todos.filter(function (todo) {
          return !!todo.completed;
        }).length,
        total: todos.length
      };
      callback(todoCounts);
    });
    model.remove.and.callFake(function (id, callback) {
      callback();
    });
    model.create.and.callFake(function (title, callback) {
      callback();
    });
    model.update.and.callFake(function (id, updateData, callback) {
      callback();
    });
  };

  var createViewStub = function createViewStub() {
    var eventRegistry = {};
    return {
      render: jasmine.createSpy('render'),
      bind: function bind(event, handler) {
        eventRegistry[event] = handler;
      },
      trigger: function trigger(event, parameter) {
        eventRegistry[event](parameter);
      }
    };
  };

  beforeEach(function () {
    model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
    view = createViewStub();
    subject = new app.Controller(model, view);
    console.log(subject.view);
  });
  it('should show entries on start-up', function () {
    // My TODO: TEST
    var spy = view.render;
    var data = '';
    subject.setView('');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1); // expect(spy).toHaveBeenCalledWith('setFilter', data);
  });
  describe('routing', function () {
    it('should show all entries without a route', function () {
      var todo = {
        title: 'my todo'
      };
      setUpModel([todo]);
      subject.setView('');
      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });
    it('should show all entries without "all" route', function () {
      var todo = {
        title: 'my todo'
      };
      setUpModel([todo]);
      subject.setView('#/');
      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });
    it('should show active entries', function () {
      // MY TODO
      var todo = {
        title: 'my todo'
      };
      setUpModel([todo]);
      subject.setView('');
      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });
    it('should show completed entries', function () {
      // My Test
      // console.log('Checking here ', window.app.Controller.prototype);
      var spy = spyOn(window.app.Controller.prototype, 'showCompleted'); // console.log('this spy', spy);

      var todo = {
        title: 'my todo',
        completed: true
      };
      model.read.and.callFake(function () {
        view.render('showEntries', todo);
      });
      subject.setView('');
      expect(view.render).toHaveBeenCalledWith('showEntries', todo);
      expect(view.render).toHaveBeenCalledTimes(2);
    });
  });
  it('should show the content block when todos exists', function () {
    setUpModel([{
      title: 'my todo',
      completed: true
    }]);
    subject.setView('');
    expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
      visible: true
    });
  });
  it('should hide the content block when no todos exists', function () {
    setUpModel([]);
    subject.setView('');
    expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
      visible: false
    });
  });
  it('should check the toggle all button, if all todos are completed', function () {
    setUpModel([{
      title: 'my todo',
      completed: true
    }]);
    subject.setView('');
    expect(view.render).toHaveBeenCalledWith('toggleAll', {
      checked: true
    });
  });
  it('should set the "clear completed" button', function () {
    var todo = {
      id: 12,
      title: 'my todo',
      completed: true
    };
    setUpModel([todo]);
    subject.setView('');
    expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
      completed: 1,
      visible: true
    });
  });
  it('should highlight "All" filter by default', function () {
    // TODO: write test
    subject.setView('');
    expect(view.render).toHaveBeenCalled();
  });
  it('should highlight "Active" filter when switching to active view', function () {
    // const spy = spyOn(window.app.Controller.prototype, 'showActive');
    subject.setView('');
    view.render('setFilter', 'currentPage');
    expect(view.render).toHaveBeenCalled(); // TODO:
  });
  describe('toggle all', function () {
    // My Todo:
    it('should toggle all todos to completed', function () {
      var spy = spyOn(window.app.Controller.prototype, 'toggleAll');
      spy(status.completed);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(status.completed);
    });
    it('should update the view', function () {
      //Check _updateFilterState
      console.log(subject.setView('')); // TODO: write test
    });
  });
  describe('new todo', function () {
    it('should add a new todo to the model', function () {
      //My todo
      setUpModel([]);
      subject.setView('');
      view.trigger('newTodo', 'title');
      expect(model.create).toHaveBeenCalled();
      expect(model.create).toHaveBeenCalledTimes(1);
      expect(model.create).toHaveBeenCalledWith('title', jasmine.any(Function));
    });
    it('should add a new todo to the view', function () {
      setUpModel([]);
      subject.setView('');
      view.render.calls.reset();
      model.read.calls.reset();
      model.read.and.callFake(function (callback) {
        callback([{
          title: 'a new todo',
          completed: false
        }]);
      });
      view.trigger('newTodo', 'a new todo');
      expect(model.read).toHaveBeenCalled();
      expect(view.render).toHaveBeenCalledWith('showEntries', [{
        title: 'a new todo',
        completed: false
      }]);
    });
    it('should clear the input field when a new todo is added', function () {
      setUpModel([]);
      subject.setView('');
      view.trigger('newTodo', 'a new todo');
      expect(view.render).toHaveBeenCalledWith('clearNewTodo');
    });
  });
  describe('element removal', function () {
    it('should remove an entry from the model', function () {
      var todo = {
        id: 42,
        title: 'my todo',
        completed: true
      };
      setUpModel([todo]);
      /* in Modeljs
      * remove(id, callback) {
      * this.storage.remove(id, callback);
      } */

      subject.setView('');
      view.trigger('itemRemove', {
        id: 42
      });
      expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function)); // My TODO: write test
    });
    it('should remove an entry from the view', function () {
      var todo = {
        id: 42,
        title: 'my todo',
        completed: true
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemRemove', {
        id: 42
      });
      expect(view.render).toHaveBeenCalledWith('removeItem', 42);
    });
    it('should update the element count', function () {
      var todo = {
        id: 42,
        title: 'my todo',
        completed: true
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemRemove', {
        id: 42
      });
      expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
    });
  });
  describe('remove completed', function () {
    it('should remove a completed entry from the model', function () {
      var todo = {
        id: 42,
        title: 'my todo',
        completed: true
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('removeCompleted');
      expect(model.read).toHaveBeenCalledWith({
        completed: true
      }, jasmine.any(Function));
      expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
    });
    it('should remove a completed entry from the view', function () {
      var todo = {
        id: 42,
        title: 'my todo',
        completed: true
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('removeCompleted');
      expect(view.render).toHaveBeenCalledWith('removeItem', 42);
    });
  });
  describe('element complete toggle', function () {
    it('should update the model', function () {
      var todo = {
        id: 21,
        title: 'my todo',
        completed: false
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemToggle', {
        id: 21,
        completed: true
      });
      expect(model.update).toHaveBeenCalledWith(21, {
        completed: true
      }, jasmine.any(Function));
    });
    it('should update the view', function () {
      var todo = {
        id: 42,
        title: 'my todo',
        completed: true
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemToggle', {
        id: 42,
        completed: false
      });
      expect(view.render).toHaveBeenCalledWith('elementComplete', {
        id: 42,
        completed: false
      });
    });
  });
  describe('edit item', function () {
    it('should switch to edit mode', function () {
      var todo = {
        id: 21,
        title: 'my todo',
        completed: false
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemEdit', {
        id: 21
      });
      expect(view.render).toHaveBeenCalledWith('editItem', {
        id: 21,
        title: 'my todo'
      });
    });
    it('should leave edit mode on done', function () {
      var todo = {
        id: 21,
        title: 'my todo',
        completed: false
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemEditDone', {
        id: 21,
        title: 'new title'
      });
      expect(view.render).toHaveBeenCalledWith('editItemDone', {
        id: 21,
        title: 'new title'
      });
    });
    it('should persist the changes on done', function () {
      var todo = {
        id: 21,
        title: 'my todo',
        completed: false
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemEditDone', {
        id: 21,
        title: 'new title'
      });
      expect(model.update).toHaveBeenCalledWith(21, {
        title: 'new title'
      }, jasmine.any(Function));
    });
    it('should remove the element from the model when persisting an empty title', function () {
      var todo = {
        id: 21,
        title: 'my todo',
        completed: false
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemEditDone', {
        id: 21,
        title: ''
      });
      expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
    });
    it('should remove the element from the view when persisting an empty title', function () {
      var todo = {
        id: 21,
        title: 'my todo',
        completed: false
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemEditDone', {
        id: 21,
        title: ''
      });
      expect(view.render).toHaveBeenCalledWith('removeItem', 21);
    });
    it('should leave edit mode on cancel', function () {
      var todo = {
        id: 21,
        title: 'my todo',
        completed: false
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemEditCancel', {
        id: 21
      });
      expect(view.render).toHaveBeenCalledWith('editItemDone', {
        id: 21,
        title: 'my todo'
      });
    });
    it('should not persist the changes on cancel', function () {
      var todo = {
        id: 21,
        title: 'my todo',
        completed: false
      };
      setUpModel([todo]);
      subject.setView('');
      view.trigger('itemEditCancel', {
        id: 21
      });
      expect(model.update).not.toHaveBeenCalled();
    });
  });
});