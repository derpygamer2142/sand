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
let element = 1

document.addEventListener("mousedown", (e) => {mouseDown = true})
document.addEventListener("mouseup", (e) => {mouseDown = false})
document.addEventListener("mousemove", (e) => {mouseX = e.clientX; mouseY = e.clientY})
document.addEventListener("keydown", (e) => {
    if (["1","2","3","4","5","6","7","8","9","0"].includes(e.key)) {
        element = Number.parseInt(e.key)
    }
})


function swap(x1,y1,x2,y2) {
    const held = structuredClone(next[x1][y1])
    next[x1][y1] = structuredClone(next[x2][y2])
    next[x2][y2] = held
}

function inBounds(x) {
    return (x >= 0) && (x <= 99)
}

class Particle {
    constructor(type,solid,gravity,spread,liquid,color) {
        this.type = type
        this.solid = solid
        this.gravity = gravity
        this.spread = spread
        this.color = color
        this.liquid = liquid
    }
}

for (let x = 0; x < scale * 100; x += scale) {
    let column = []
    for (let y = 0; y < scale * 100; y += scale) {
        column.push(new Particle(0,false,false,false,"#ffffff"))
    }
    scene.push(column)
}


//scene[0][0] = new Particle(1,true,true,true,false,"#96691a")



setInterval(() => {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canv.width,canv.height)
    
    if (mouseDown) {
        const xi = Math.min(Math.max(Math.floor((mouseX / (scale))),0),99)
        const yi = Math.floor((mouseY / canv.height) * 100)

        if (scene[xi][yi].type === 0) {
            switch (element) {
                case 1: {
                    scene[xi][yi] = new Particle(1,true,true,true,false,"#96691a")
                    break;
                }
                case 2: {
                    scene[xi][yi] = new Particle(2,false,true,true,true,"#2d8be3")
                    break;
                }
            }
            
        }
    }

    next = structuredClone(scene)

    
    for (let x = 0; x < scene.length; x++) {
        for (let y = 0; y < scene[0].length; y++) {
            //const y = (scene[0].length - fy) - 1
            if (scene[x][y].type !== 0) {
                ctx.fillStyle = scene[x][y].color
                ctx.fillRect(x*scale,Math.floor(((y / 100) * canv.height)/scale) * scale, scale, scale)
                
                if (!scene[x][y].liquid) {
                    if (y < 99 && !scene[x][y+1]?.solid && scene[x][y+1]?.type !== scene[x][y].type && scene[x][y].gravity && !scene[x][y].liquid) {
                        swap(x,y,x,y+1)
                    }
                    else if (inBounds(x-1) && inBounds(y+1) && !scene[x-1][y+1].solid && scene[x][y].spread) {
                        swap(x-1,y+1,x,y)
                    }
                    else if (inBounds(x+1) && inBounds(y+1) && !scene[x+1][y+1].solid && scene[x][y].spread) {
                        swap(x+1,y+1,x,y)
                    }
                }
                else {
                    console.log(scene[x][y])
                    if (y < 99 && scene[x][y+1]?.type === 0 && scene[x][y].gravity) {
                        
                        swap(x,y,x,y+1)
                    }
                    
                    else if (inBounds(x-1) && inBounds(y+1) && scene[x-1][y+1]?.type !== scene[x][y].type && scene[x-1][y+1]?.type === 0 && scene[x][y].spread) {
                        swap(x-1,y+1,x,y)
                    }
                    else if (inBounds(x+1) && inBounds(y+1) && scene[x+1][y+1]?.type !== scene[x][y].type && scene[x+1][y+1]?.type === 0 && scene[x][y].spread) {
                        swap(x+1,y+1,x,y)
                    }

                    else if (inBounds(x-1) && scene[x-1][y]?.type !== scene[x][y].type && !scene[x-1][y].solid && scene[x][y].spread) {
                        swap(x-1,y,x,y)
                    }
                    else if (inBounds(x+1) && scene[x+1][y]?.type !== scene[x][y].type && !scene[x+1][y].solid && scene[x][y].spread) {
                        swap(x+1,y,x,y)
                    }
                }
                

                
                
            }
            

        }
    }

    scene = structuredClone(next)
    //console.log(scene)
},(1 / 60) * 1000)