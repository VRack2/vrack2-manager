import deviceGrid from "@/assets/device-grid.js";

class DeviceSVG {

    portGroupWSteps = 4
    deviceIntervalSteps = 2
    groupPadding = deviceGrid.getStepPercent(20)
    ready = false
    leftConnections = {}
    rightConnections = {}
    device = {}
    inputs = {}
    outputs = {}
    inputsById = {}
    outputsById = {}
    hSteps = 0
    wSteps = 0
    x = 0
    y = 0
    deviceX = 0
    deviceY = 0
    relation = []
    radius = deviceGrid.getStepPercent(18)
    constructor(){
        
    }
    /**
     * {
     *   "id": "InterService",
     *   "type": "vrack.InterService",
     *   "outputs": {},
     *   "inputs": {
     *       "command1": [
     *       {
     *           "device": "Interval",
     *           "port": "gate"
     *       }
     *       ],
     *       "command2": []
     *   },
     *   "ports": [
     *       {
     *       "port": "command1",
     *       "direct": "input",
     *       "type": "return",
     *       "description": "Port for run internal VRack2 service command",
     *       "required": false,
     *       "dynamic": false,
     *       "count": 0,
     *       },
     *       {
     *       "port": "command2",
     *       "direct": "input",
     *       "type": "return",
     *       "description": "Port for run internal VRack2 service command",
     *       "required": false,
     *       "dynamic": false,
     *       "count": 0,
     *       }
     *   ],
     * }
     * 
    */
    setDevice(device){
        if (device === undefined) return 
        this.device = device
        const inputs = []
        const outputs = []
        // Заполняем входы и выходы
        for (const port of this.device.ports) { 
            if (port.direct === 'output') { 
                outputs.push(port); 
                this.outputsById[port.port] = port
            } else { 
                inputs.push(port) 
                this.inputsById[port.port] = port
            }
        }
        const deviceStart = deviceGrid.fromStep(this.deviceIntervalSteps + this.portGroupWSteps)
        this.inputs = this.calcPorts(inputs)
        const inputSteps =  this.calcSteps(this.inputs, deviceStart, deviceGrid.fromStep(1))
        this.outputs = this.calcPorts(outputs)
        const outputSteps = this.calcSteps(this.outputs, deviceStart + deviceGrid.fromStep(this.portGroupWSteps), deviceGrid.fromStep(1), true)
        this.device.hSteps = Math.max(inputSteps, outputSteps ) + 2



        // Заполняем теперь левый и правый 
        const leftConectionsList = this.getPortsOfConnections(this.device.inputs)
        const rightConnectionsList = this.getPortsOfConnections(this.device.outputs)

        this.leftConnections = this.calcCPorts(leftConectionsList)
        this.rightConnections = this.calcCPorts(rightConnectionsList)
        const offsetRight = deviceGrid.fromStep((this.portGroupWSteps * 3) + this.deviceIntervalSteps * 2)
        this.hSteps = Math.max(this.device.hSteps,this.calcSteps(this.leftConnections, 0,0, true),this.calcSteps(this.rightConnections, offsetRight, 0, false))
        this.wSteps = (this.portGroupWSteps * 4) + (2 * this.deviceIntervalSteps)

        // Add relations 
        this.relation = []
        this.addRelations(leftConectionsList,'inputsById')
        this.addRelations(rightConnectionsList,'outputsById')
        this.ready = true
    }

    getPortsOfConnections(cons){
        const result = []
        for (const ip in cons){
            for (const p of cons[ip]) {
                p.toPort = ip
                p.color = deviceGrid.getRandomColor()
                result.push(p)
            }
        }
        return result;
    }

    /**
     * Считает высоту 
     * 
     * 
    */
    calcPorts (ports) {
        const tree = { main: { ports: [], started: 0, steps: 0 } }
        for (const port of ports) {
            const acts = port.port.split('.')
            if (acts.length > 1) {
                if (!tree[acts[0]]) tree[acts[0]] = { ports: [], started: 0, steps: 0 }
                port.label = acts[1]
                tree[acts[0]].ports.push(port)
            }else { 
                port.label = port.port
                tree.main.ports.push(port)
            }
        }
        return tree
    }

    calcCPorts(ports){
        const tree = {}
        for (const port of ports) {
            if (!tree[port.device]) tree[port.device] = { ports: [], started: 0, steps: 0 }
            port.label = port.port
            tree[port.device].ports.push(port)
        }
        return tree
    }


    addRelations(ports, kList){
        for (const port of ports) {
            if (!this[kList][port.toPort]) continue
            const tp = this[kList][port.toPort]
            this.relation.push({ fromX: port.x, fromY: port.y, color: port.color, toX: tp.x, toY: tp.y })
        }
    }

    /**
     * 
    */
    calcSteps(tree, x, y, second){
        let steps = 0
        for (const group in tree) {
            if (tree[group].ports.length) { 
                tree[group].started = steps
                tree[group].x = x
                tree[group].y = deviceGrid.fromStep(tree[group].started) + y
                tree[group].steps = tree[group].ports.length + 1
                const portsStart = deviceGrid.fromStep(1) + tree[group].y
                let i = 0
                for (const port of tree[group].ports){
                    port.x = second?deviceGrid.fromStep(this.portGroupWSteps) + x - (this.groupPadding * 3):x + (this.groupPadding * 3);
                    port.y = deviceGrid.fromStep(i) + portsStart + (deviceGrid.grid.step/2)
                    i++
                }
                steps += tree[group].steps
            }
        } 
        return steps
    }
}

// const DeviceSVG = new DeviceSVGClass()

export { DeviceSVG }