Vue.component('tasks', {
  template: "#tasks-template",

  props: ['list'],

  computed: {
    remaining: function() {
      return this.list.filter(this.isProgress).length
    }
  },

  methods: {
    toggleTask: function(task) {
      task.completed = !task.completed
    },

    isCompleted: function(task) {
      return task.completed
    },

    isProgress: function(task) {
      return !this.isCompleted(task)
    },

    deleteTask: function(task) {
      this.list.$remove(task)
    },

    clearCompleted: function() {
      this.list = this.list.filter(this.isProgress)
    }
  }
})

new Vue({
  el: "#app",

  data: {
    tasks: [
      { body: "Go to work", completed: false },
      { body: "Go to bank", completed: false },
      { body: "Go to mall", completed: true },
    ]
  }
})