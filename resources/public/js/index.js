// Lib Stuff -->
function daysInMonth(date) {
  return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate()
}
// <-- End of Lib Stuff
var x = document.getElementById("monthName");
x.innerHTML = "july or some shit";

const daysNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

var daysAndDays = new Vue({
  el: '#daysNDays',
  data: {
    days: daysNames
  }
})

const vm = new Vue({
  el: '#app',
  template: "<h1>mannnnnnn!NN</h1>"
})
