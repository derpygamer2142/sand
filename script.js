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

class Color {
    constructor(r,g,b) {
        this.r = r
        this.g = g
        this.b = b
    }

    text() {
        return `rgb(${this.r},${this.g},${this.b})`
    }
}

class Particle {
    constructor(type,solid,gravity,spread,liquid,color,flammable,gas, lifetime) {
        this.type = type
        this.solid = solid
        this.gravity = gravity
        this.spread = spread
        this.liquid = liquid
        this.color = color
        this.flammable = flammable
        this.gas = gas
        this.lifetime = lifetime
    }
}



class Type {//[0,false,false,false,false,"#ffffff",false,false,Infinity]
    static AIR =  {
        type: 0,
        solid: false,
        gravity: false,
        spread: false,
        liquid: false,
        color: "#ffffff",
        flammable: false,
        gas: false,
        lifetime: Infinity
    }
    static GROUND = {
        type: 1,
        solid: true,
        gravity: true,
        spread: true,
        liquid: false,
        color: "#96691a",
        flammable: false,
        gas: false,
        lifetime: Infinity
    }//[1,true,true,true,false,"#96691a",false,false,Infinity]
    static WATER = {
        type: 2,
        solid: false,
        gravity: true,
        spread: true,
        liquid: true,
        color: "#2d8be3",
        flammable: false,
        gas: false,
        lifetime: Infinity
    }//[2,false,true,true,true,"#2d8be3",false,false,Infinity]
    static WOOD = {
        type: 3,
        solid: true,
        gravity: false,
        spread: true,
        liquid: false,
        color: "#c98122",
        flammable: true,
        gas: false,
        lifetime: Infinity
    }//[3,true,false,true,false,"#c98122",true,false,Infinity]
    static FIRE = {
        type: 4,
        solid: false,
        gravity: true,
        spread: true,
        liquid: false,
        color: "#eb8d0e",
        flammable: false,
        gas: true,
        lifetime: 15
    }//[4,false,true,true,false,"#eb8d0e",false,true,30]
    static SMOKE = {
        type: 5,
        solid: false,
        gravity: true,
        spread: true,
        liquid: false,
        color: "#707070",
        flammable: false,
        gas: true,
        lifetime: 15
    }//[5,false,true,true,false,"#707070",false,true,30]
}


//scene[0][0] = new Particle(1,true,true,true,false,"#96691a")

function newParticle(type) {
    const np = new Particle()
    Object.keys(np).forEach((v) => {
        np[v] = type[v]
    })
    return np//np.apply(null,type)
}
//console.log(Particle.bind)
//console.log(scene)


for (let x = 0; x < scale * 100; x += scale) {
    let column = []
    for (let y = 0; y < scale * 100; y += scale) {
        column.push(newParticle(Type.AIR))
    }
    scene.push(column)
}


setInterval(() => {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canv.width,canv.height)
    const xi = Math.min(Math.max(Math.floor((mouseX / (scale))),0),99)
    const yi = Math.floor((mouseY / canv.height) * 100)
    if (mouseDown) {
        

        if (scene[xi][yi].type === Type.AIR.type) {
            switch (element) {
                case 1: {
                    scene[xi][yi] = newParticle(Type.GROUND)
                    //console.log(scene[xi][yi])
                    break;
                }
                case 2: {
                    scene[xi][yi] = newParticle(Type.WATER)
                    break;
                }
                case 3: {
                    scene[xi][yi] = newParticle(Type.WOOD)
                    break;
                }
                case 4: {
                    scene[xi][yi] = newParticle(Type.FIRE)
                    break;
                }
                case 5: {
                    scene[xi][yi] = newParticle(Type.SMOKE)
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
                ctx.fillStyle = scene[x][y]?.color ?? "rgb(0,255,0)"
                ctx.fillRect(x*scale,/*Math.floor(((y / 100) * canv.height)/scale) * scale*/y*scale, scale, scale)


                if (isFinite(scene[x][y].lifetime) || isNaN(scene[x][y].lifetime)) {
                    if (isNaN(scene[x][y].lifetime)) {
                        console.warn("there is a NaN lifetime at ",x,y)
                        next[x][y].color = "#00ff00"
                    }
                    
                    const lt = scene[x][y].lifetime
                    if (lt < 0) {
                        if (scene[x][y].type === Type.AIR.type) {
                            next[x][y] = newParticle(Type.AIR)
                        }
                        else if (scene[x][y].type === Type.FIRE.type) {
                            if (!Math.round(Math.random())) {
                                next[x][y] = newParticle(Type.SMOKE)
                                console.log("new smoke from fire")
                                continue
                            }
                            else {
                                next[x][y] = newParticle(Type.AIR)
                                continue
                            }
                        }
                        else if (scene[x][y].type === Type.WOOD.type) {
                            if (!Math.round(Math.random())) {
                                next[x][y] = newParticle(Type.SMOKE)
                                continue
                            }
                            else {
                                next[x][y] = newParticle(Type.FIRE)
                                continue
                            }
                        }
                        else if (scene[x][y].type === Type.SMOKE.type) {
                            next[x][y] = newParticle(Type.AIR)
                            continue
                        }
                    }
                    else {
                        next[x][y].lifetime -= 1
                    }
                }

                if (scene[x][y].type === Type.FIRE.type) next[x][y].color = "#" + scene[x][y].color.slice(1,3) + (Number.parseInt("0x" + scene[x][y].color.slice(3,5))-3).toString(16) + scene[x][y].color.slice(5,7)
                if (scene[x][y].type === Type.WOOD.type) next[x][y].color = scene[x][y].lifetime < 16 ? "#eb8d0e" : "#c98122"

                
                if (scene[x][y].solid) {
                    if (y < 99 && !scene[x][y+1]?.solid && scene[x][y+1]?.type !== scene[x][y].type && scene[x][y].gravity && !scene[x][y].liquid) {
                        swap(x,y,x,y+1)
                    }
                    else if (inBounds(x-1) && inBounds(y+1) && !scene[x-1][y+1].solid && scene[x][y].spread && scene[x][y].gravity) {
                        swap(x-1,y+1,x,y)
                    }
                    else if (inBounds(x+1) && inBounds(y+1) && !scene[x+1][y+1].solid && scene[x][y].spread && scene[x][y].gravity) {
                        swap(x+1,y+1,x,y)
                    }x

                    if (scene[x][y].flammable && scene[x][y].lifetime < 16 && inBounds(y-1)) {
                        if (scene[x][y-1].type === Type.AIR.type && Math.random() < 0.3) next[x][y-1] = newParticle(Type.FIRE)
                    }
                    
                    if (scene[x][y].flammable && scene[x][y].lifetime < 16) {
                        for (let d = 0; d < Math.PI*2;d+=(Math.PI/2)) {
                            const sx = Math.round(Math.sin(d))
                            const cy = Math.round(Math.cos(d))
                            if (inBounds(sx + x) && inBounds(cy + y)) {
                                if (scene[sx + x][cy + y].type === Type.WOOD.type && Math.random() < 0.6) scene[sx + x][cy + y].lifetime = 15
                            }
                        }
                    }
                }
                else if (scene[x][y].liquid) {
                    if (y < 99 && (scene[x][y+1]?.type === Type.AIR.type || scene[x][y+1]?.type === Type.FIRE.type) && scene[x][y].gravity) {
                        if (scene[x][y+1].type === Type.FIRE.type) next[x][y+1].lifetime = 0
                        else swap(x,y,x,y+1)
                        
                    }
                    
                    else if (inBounds(x-1) && inBounds(y+1) && scene[x-1][y+1]?.type !== scene[x][y].type && (scene[x-1][y+1]?.type === Type.AIR.type || scene[x-1][y+1]?.type === Type.FIRE.type) && scene[x][y].spread && scene[x][y].gravity) {
                        if (scene[x-1][y+1].type === Type.FIRE.type) next[x-1][y+1].lifetime = 0
                        else swap(x-1,y+1,x,y)
                    }
                    else if (inBounds(x+1) && inBounds(y+1) && scene[x+1][y+1]?.type !== scene[x][y].type && (scene[x+1][y+1]?.type === Type.AIR.type || scene[x+1][y+1]?.type === Type.FIRE.type) && scene[x][y].spread && scene[x][y].gravity) {
                        if (scene[x+1][y+1].type === Type.FIRE.type) next[x+1][y+1].lifetime = 0
                        else swap(x+1,y+1,x,y)
                    }

                    else if (inBounds(x-1) && (scene[x-1][y]?.type !== scene[x][y].type) && !scene[x-1][y].solid && scene[x][y].spread && (scene[x-1][y]?.type === Type.AIR.type || scene[x-1][y]?.type === Type.FIRE.type)) {
                        if (scene[x-1][y].type === Type.FIRE.type) next[x-1][y].lifetime = 0
                        else swap(x-1,y,x,y)
                    }
                    else if (inBounds(x+1) && scene[x+1][y]?.type !== scene[x][y].type && !scene[x+1][y].solid && scene[x][y].spread && (scene[x+1][y]?.type === Type.AIR.type || scene[x+1][y]?.type === Type.FIRE.type)) {
                        if (scene[x+1][y].type === Type.FIRE.type) next[x+1][y].lifetime = 0
                        else swap(x+1,y,x,y)
                    }
                }
                else if (scene[x][y].gas) {
                    try {
                        let f = true
                        if (inBounds(x-1) && inBounds(y-1) && scene[x-1][y-1]?.type === Type.AIR.type && scene[x-1][y-1]?.type === Type.AIR.type && scene[x][y].spread && scene[x][y].gravity && Math.round(Math.random())) {
                            swap(x-1,y-1,x,y)
                            f = false
                        }
                        else if (inBounds(x-1) && inBounds(y+1) && scene[x+1][y-1]?.type === Type.AIR.type && scene[x+1][y-1]?.type === Type.AIR.type && scene[x][y].spread && scene[x][y].gravity) {
                            swap(x+1,y-1,x,y)
                            f = false
                        }
                        else if (y > 0 && scene[x][y-1]?.type === Type.AIR.type && scene[x][y].gravity) {
                            swap(x,y,x,y-1)
                        }
                        
                        else if (inBounds(x-1) && inBounds(y-1) && scene[x-1][y-1]?.type === Type.AIR.type && scene[x-1][y-1]?.type === Type.AIR.type && scene[x][y].spread && scene[x][y].gravity && Math.round(Math.random())) {
                            swap(x-1,y-1,x,y)
                            f = false
                        }
                        else if (inBounds(x-1) && inBounds(y+1) && scene[x+1][y-1]?.type === Type.AIR.type && scene[x+1][y-1]?.type === Type.AIR.type && scene[x][y].spread && scene[x][y].gravity && Math.round(Math.random())) {
                            swap(x+1,y-1,x,y)
                            f = false
                        }
                        
                        if (f) {
                            const dir = (Math.round(Math.random())*2)-1
                            
                            if (inBounds(x+dir) && scene[x+dir][y]?.type === Type.AIR.type && !scene[x+dir][y].solid && scene[x][y].spread) {
                                swap(x+dir,y,x,y)
                                
                            }
                            else if (inBounds(x-dir) && scene[x-dir][y]?.type === Type.AIR.type && !scene[x-dir][y].solid && scene[x][y].spread) {
                                swap(x-dir,y,x,y)
                            }
                        }
                        

                        if (scene[x][y].type === Type.FIRE.type) {
                            const u = Math.random()*100 < 35

                            for (let a = 0; a < Math.PI*2; a += Math.PI/4) {
                                const px = Math.round(Math.sin(a))
                                const py = Math.round(Math.cos(a))
                                if (inBounds(x + px) && inBounds(y + py)) {
                                    
                                    if (scene[x+px][y+py].flammable && next[x+px][y+py].lifetime > 15 && u && scene[x+px][y+py].type !== scene[x][y].type) {
                                        next[x+px][y+py].lifetime = 15// = newParticle(Type.FIRE)
                                    }
                                
                                }
                            }
                            
                        }
                    }
                    catch {
                        // who cares
                    }
                    
                }
                
                
            }
            

        }
    }

    ctx.fillStyle = "black"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 5
    ctx.font = "25px Arial"
    ctx.strokeRect(xi*scale,Math.floor(((yi / 100) * canv.height)/scale) * scale, scale, scale)
    ctx.fillText(JSON.stringify(scene[xi][yi]),xi*scale + 10,Math.floor(((yi / 100) * canv.height)/scale) * scale + 25 + scale)
    //ctx.fillText(scene[xi][yi].color,xi*scale + 10,Math.floor(((yi / 100) * canv.height)/scale) * scale + 50 + scale)
    //ctx.fillText(scene[xi][yi].lifetime,xi*scale + 10,Math.floor(((yi / 100) * canv.height)/scale) * scale + 75 + scale)
    scene = structuredClone(next)
    //console.log(scene)
},(1 / 60) * 1000)