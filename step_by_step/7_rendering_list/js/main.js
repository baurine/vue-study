new Vue({
  el: "#app",

  data: {
    tasks: [
      { body: "Go to work", completed: false },
      { body: "Go to bank", completed: false },
      { body: "Go to mall", completed: true },
    ]
  },

  methods: {
    toggleTask: function(task) {
      task.completed = !task.completed
    }
  }
})