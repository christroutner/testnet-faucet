/*
  This is a dummy application that never exits. It keeps the Docker container
  alive so that a developer can enter the container and debug the real application.
*/

"use strict"

let i = 0

setInterval(function() {
  i++
}, 30000)
