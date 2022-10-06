const canvas = document.querySelector('canvas')
// * c will be used a lot so we make it short.
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)