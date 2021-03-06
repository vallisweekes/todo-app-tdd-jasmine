/*global app, jasmine, describe, it, beforeEach, expect */

describe('Controller', () => {
  'use strict';

  var subject, model, view;

  var setUpModel = (todos) => {
    model.read.and.callFake((query, callback) => {
      callback = callback || query;
      callback(todos);
    });

    model.getCount.and.callFake((callback) => {
      var todoCounts = {
        active: todos.filter((todo) => !todo.completed).length,
        completed: todos.filter((todo) => !!todo.completed).length,
        total: todos.length,
      };

      callback(todoCounts);
    });

    model.remove.and.callFake((id, callback) => {
      callback();
    });

    model.create.and.callFake((title, callback) => {
      callback();
    });

    model.update.and.callFake((id, updateData, callback) => {
      callback();
    });
  };

  var createViewStub = () => {
    var eventRegistry = {};
    return {
      render: jasmine.createSpy('render'),
      bind: (event, handler) => {
        eventRegistry[event] = handler;
      },
      trigger: (event, parameter) => {
        eventRegistry[event](parameter);
      },
    };
  };

  beforeEach(() => {
    model = jasmine.createSpyObj('model', [
      'read',
      'getCount',
      'remove',
      'create',
      'update',
    ]);

    view = createViewStub();
    subject = new app.Controller(model, view);
  });

  it('should show entries on start-up', () => {
    // TODO: 1
    var todo = { title: 'my todo' };
    setUpModel([todo]);

    subject.setView('/');
    expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
  });

  describe('routing', () => {
    it('should show all entries without a route', () => {
      var todo = { title: 'my todo' };
      setUpModel([todo]);

      subject.setView('');
      expect(model.read).toHaveBeenCalled();
      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show all entries without "all" route', () => {
      var todo = { title: 'my todo' };
      setUpModel([todo]);

      subject.setView('#/');

      expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
    });

    it('should show active entries', () => {
      // TODO: 2
      // var todo = { title: 'my todo' };
      const todo = [
        { title: 'my todo', completed: true },
        { title: 'my todo', completed: false },
      ];
      setUpModel(todo);

      subject.setView('#/active');
      expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
      expect(view.render).toHaveBeenCalledWith('showEntries', todo);
    });

    it('should show completed entries', () => {
      // TODO: 3

      const todo = [
        { title: 'my todo', completed: true },
        { title: 'my todo', completed: false },
      ];

      model.read.and.callFake(() => {
        view.render('showEntries', todo);
      });

      subject.setView('#/completed');
      expect(view.render).toHaveBeenCalledWith('setFilter', 'completed');
      expect(view.render).toHaveBeenCalledWith('showEntries', todo);
      expect(view.render).toHaveBeenCalledTimes(2);
    });
  });

  it('should show the content block when todos exists', () => {
    setUpModel([{ title: 'my todo', completed: true }]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
      visible: true,
    });
    expect(view.render).toHaveBeenCalled();
  });

  it('should hide the content block when no todos exists', () => {
    setUpModel([]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
      visible: false,
    });
  });

  it('should check the toggle all button, if all todos are completed', () => {
    setUpModel([{ title: 'my todo', completed: true }]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('toggleAll', {
      checked: true,
    });
  });

  it('should set the "clear completed" button', () => {
    var todo = { id: 12, title: 'my todo', completed: true };
    setUpModel([todo]);

    subject.setView('');

    expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
      completed: 1,
      visible: true,
    });
  });

  it('should highlight "All" filter by default', () => {
    // TODO: 4
    const currentPage = '';

    subject.setView('');
    expect(view.render).toHaveBeenCalledWith('setFilter', currentPage);
    expect(view.render).toHaveBeenCalledTimes(1);
  });

  it('should highlight "Active" filter when switching to active view', () => {
    // TODO: 5
    // const currentPage = '';
    subject.setView('#/active');
    expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
    expect(view.render).toHaveBeenCalledTimes(1);
  });

  describe('toggle all', () => {
    // TODO: 6

    it('should toggle all todos to completed', () => {
      const todos = [
        { id: 1, title: 'my todo', completed: false },
        { id: 2, title: 'my todo', completed: true },
      ];
      setUpModel(todos);
      subject.setView('');
      view.render.calls.reset();
      model.read.calls.reset();
      view.trigger('toggleAll', { completed: true }); // toggle to true, but all not completed
      expect(model.read).toHaveBeenCalledWith(
        { completed: false },
        jasmine.any(Function)
      );
      expect(model.update).toHaveBeenCalledWith(
        1,
        { completed: true },
        jasmine.any(Function)
      );
      expect(model.update).toHaveBeenCalledWith(
        2,
        { completed: true },
        jasmine.any(Function)
      );
      // make sure its called as many times as todos length
      expect(model.update).toHaveBeenCalledTimes(todos.length);
    });

    it('should update the view', () => {
      // TODO: 7
      const todos = [
        { id: 1, title: 'my todo', completed: true },
        { id: 2, title: 'my todo', completed: true },
      ];
      subject.setView('');
      setUpModel(todos);
      view.trigger('toggleAll', { completed: true });

      //   expect(model.read).toHaveBeenCalledWith(
      //     { completed: false },
      //     jasmine.any(Function)
      //   );
      //   expect(model.update).toHaveBeenCalledWith(
      //     1,
      //     { completed: true },
      //     jasmine.any(Function)
      //   );
      //   expect(model.update).toHaveBeenCalledWith(
      //     2,
      //     { completed: true },
      //     jasmine.any(Function)
      //   );
      expect(view.render).toHaveBeenCalledWith('toggleAll', { checked: true });
      expect(view.render).toHaveBeenCalledWith('setFilter', '');
    });
  });

  describe('new todo', () => {
    it('should add a new todo to the model', () => {
      //TODO: 8
      setUpModel([]);
      subject.setView('');
      view.trigger('newTodo', 'title');
      expect(model.create).toHaveBeenCalled();
      expect(model.create).toHaveBeenCalledTimes(1);
      expect(model.create).toHaveBeenCalledWith('title', jasmine.any(Function));
    });

    it('should add a new todo to the view', () => {
      setUpModel([]);

      subject.setView('');

      view.render.calls.reset();
      model.read.calls.reset();
      model.read.and.callFake(function (callback) {
        callback([
          {
            title: 'a new todo',
            completed: false,
          },
        ]);
      });

      view.trigger('newTodo', 'a new todo');

      expect(model.read).toHaveBeenCalled();

      expect(view.render).toHaveBeenCalledWith('showEntries', [
        {
          title: 'a new todo',
          completed: false,
        },
      ]);
    });

    it('should clear the input field when a new todo is added', () => {
      setUpModel([]);

      subject.setView('');

      view.trigger('newTodo', 'a new todo');

      expect(view.render).toHaveBeenCalledWith('clearNewTodo');
    });
  });

  describe('element removal', () => {
    it('should remove an entry from the model', () => {
      TODO: 9;
      var todo = [{ id: 42, title: 'my todo', completed: true }];
      setUpModel(todo);
      subject.setView('');
      view.trigger('itemRemove', { id: 42 });
      expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
    });

    it('should remove an entry from the view', () => {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('itemRemove', { id: 42 });

      expect(view.render).toHaveBeenCalledWith('removeItem', 42);
    });

    it('should update the element count', () => {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('itemRemove', { id: 42 });

      expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
    });
  });

  describe('remove completed', () => {
    it('should remove a completed entry from the model', () => {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('removeCompleted');

      expect(model.read).toHaveBeenCalledWith(
        { completed: true },
        jasmine.any(Function)
      );
      expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
    });

    it('should remove a completed entry from the view', () => {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);

      subject.setView('');
      view.trigger('removeCompleted');

      expect(view.render).toHaveBeenCalledWith('removeItem', 42);
    });
  });

  describe('element complete toggle', () => {
    it('should update the model', () => {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);
      subject.setView('');

      view.trigger('itemToggle', { id: 21, completed: true });

      expect(model.update).toHaveBeenCalledWith(
        21,
        { completed: true },
        jasmine.any(Function)
      );
    });

    it('should update the view', () => {
      var todo = { id: 42, title: 'my todo', completed: true };
      setUpModel([todo]);
      subject.setView('');

      view.trigger('itemToggle', { id: 42, completed: false });

      expect(view.render).toHaveBeenCalledWith('elementComplete', {
        id: 42,
        completed: false,
      });
    });
  });

  describe('edit item', () => {
    it('should switch to edit mode', () => {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEdit', { id: 21 });

      expect(view.render).toHaveBeenCalledWith('editItem', {
        id: 21,
        title: 'my todo',
      });
    });

    it('should leave edit mode on done', () => {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: 'new title' });

      expect(view.render).toHaveBeenCalledWith('editItemDone', {
        id: 21,
        title: 'new title',
      });
    });

    it('should persist the changes on done', () => {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: 'new title' });

      expect(model.update).toHaveBeenCalledWith(
        21,
        { title: 'new title' },
        jasmine.any(Function)
      );
    });

    it('should remove the element from the model when persisting an empty title', () => {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: '' });

      expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
    });

    it('should remove the element from the view when persisting an empty title', () => {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditDone', { id: 21, title: '' });

      expect(view.render).toHaveBeenCalledWith('removeItem', 21);
    });

    it('should leave edit mode on cancel', () => {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditCancel', { id: 21 });

      expect(view.render).toHaveBeenCalledWith('editItemDone', {
        id: 21,
        title: 'my todo',
      });
    });

    it('should not persist the changes on cancel', () => {
      var todo = { id: 21, title: 'my todo', completed: false };
      setUpModel([todo]);

      subject.setView('');

      view.trigger('itemEditCancel', { id: 21 });

      expect(model.update).not.toHaveBeenCalled();
    });
  });
});
