Vue.component('tasks', {
  template: "#tasks-template",

  data: function() {
    return {
      list: []
    }
  },

  created: function() {
    // var vm = this;
    // $.getJSON('api/todos', function(todos) {
    //   console.log(todos);
    //   vm.list = todos;
    // });

    // or
    // $.getJSON('api/todos', function(todos) {
    //   this.list = todos;
    // }.bind(this));

    this.fetchTasks();
  },

  methods: {
    fetchTasks: function() {
      $.getJSON('api/todos', function(todos) {
        this.list = todos;
      }.bind(this));
    },

    delete: function(task) {
      this.list.$remove(task);
    }
  }
});

new Vue({
  el: "#app",
});