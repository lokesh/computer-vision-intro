define([
  'marionette',
  'views/filters',
  'views/sources',
  'views/workspace'
], function (
  Marionette,
  FiltersView,
  SourcesView,
  WorkspaceLayout
) {
  'use strict';

  var $app    = $('#app');
  var $window = $(window);
  var app     = new Marionette.Application();

  app.addInitializer(function(options) {
    var workspace   = new WorkspaceLayout();
    var sourcesView = new SourcesView();
    var filtersView = new FiltersView();

    $app.append(workspace.render().$el);
    
    workspace.sources.show(sourcesView);
    workspace.filters.show(filtersView);

    resize();
    $window.on('resize', resize);
  });

  function resize() {
    var winHeight = $window.height();
    var winWidth = $window.width();
    $('#app, #toolbar, #editor').height(winHeight);
    console.log
    $('#editor').width(winWidth - 250);
  }
  
  // var todoList = new TodoList();

  // var viewOptions = {
  //   collection: todoList
  // };

  // var header = new Header(viewOptions);
  // var main = new TodoListCompositeView(viewOptions);
  // var footer = new Footer(viewOptions);

  // app.addRegions({
  //   header: '#header',
  //   main: '#main',
  //   footer: '#footer'
  // });

  // app.addInitializer(function () {
  //   app.header.show(header);
  //   app.main.show(main);
  //   app.footer.show(footer);

  //   todoList.fetch();
  // });

  // app.listenTo(todoList, 'all', function () {
  //   app.main.$el.toggle(todoList.length > 0);
  //   app.footer.$el.toggle(todoList.length > 0);
  // });

  // app.vent.on('todoList:filter', function (filter) {
  //   footer.updateFilterSelection(filter);

  //   document.getElementById('todoapp').className = 'filter-' + (filter === '' ? 'all' : filter);
  // });

  // app.vent.on('todoList:clear:completed', function () {
  //   todoList.getCompleted().forEach(function (todo) {
  //     todo.destroy();
  //   });
  // });

  return window.app = app;
});