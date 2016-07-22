Vue.component('tasks', {
  template: "#tasks-template",

  props: ['list'],

  methods: {
    toggleTask: function(task) {
      task.completed = !task.completed
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