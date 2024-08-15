const canv = document.getElementById("canv")
canv.width = window.innerWidth
canv.height = window.innerHeight

const ctx = canv.getContext("2d")

const scale = 15

let scene = [

]

let next = [

]

let mouseDown = false
let mouseX = 0
let mouseY = 0

document.addEventListener("mousedown", (e) => {mouseDown = true})
document.addEventListener("mouseup", (e) => {mouseDown = false})
document.addEventListener("mousemove", (e) => {mouseX = e.clientX; mouseY = e.clientY})


function swap(x1,y1,x2,y2) {
    const held = next[x1][y1]
    next[x1][y1] = next[x2][y2]
    next[x2][y2] = held
}

function inBounds(x) {
    return (x >= 0) && (x <= 99)
}

for (let x = 0; x < scale * 100; x += scale) {
    let column = []
    for (let y = 0; y < scale * 100; y += scale) {
        column.push(0)
    }
    scene.push(column)
}

scene[0][0] = 1



setInterval(() => {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canv.width,canv.height)
    
    if (mouseDown) {
        const xi = Math.floor((mouseX / canv.width) * 100)
        const yi = Math.floor((mouseY / canv.height) * 100)

        if (scene[xi][yi] === 0) {
            scene[xi][yi] = 1
        }
        console.log(xi, yi)
    }

    next = structuredClone(scene)

    
    for (let x = 0; x < scene.length; x++) {
        for (let y = 0; y < scene[0].length; y++) {
            //const y = (scene[0].length - fy) - 1
            if (scene[x][y] === 1) {
                ctx.fillStyle = "black"
                ctx.fillRect(Math.floor(((x / 99) * canv.width)/scale) * scale,Math.floor(((y / 99) * canv.height)/scale) * scale, scale, scale)
                
                if (y < 99 && scene[x][y+1] === 0) {
                    swap(x,y,x,y+1)
                }
                else if (inBounds(x-1) && inBounds(y+1) && scene[x-1][y+1] === 0) {
                    swap(x-1,y+1,x,y)
                }
                else if (inBounds(x+1) && inBounds(y+1) && scene[x+1][y+1] === 0) {
                    swap(x+1,y+1,x,y)
                }
            }
            

        }
    }

    scene = structuredClone(next)
    console.log(scene)
},(1 / 60) * 1000)