Vue.component('tasks', {
  template: "#tasks-template",

  data: function() {
    return {
      list: []
    }
  },

  created: function() {
    this.fetchTasks();
  },

  methods: {
    fetchTasks: function() {
      this.$http.get('/api/todos')
        .then((response) => {
          this.list = response.json()
        });
    },

    deleteTask: function(task) {
      this.list.$remove(task);
    }
  }
});

new Vue({
  el: "#app",
});