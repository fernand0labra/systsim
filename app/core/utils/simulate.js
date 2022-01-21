const { spawn } = require('child_process');

/**
 * Creates and manages the processes for making the simulation
 * 
 * @param {string} path Path to the templates of the child processes
 * @param {string[]} cps Name of each of the templates of the child processes
 * @param {any[][]} children Struct for child processes' objects
 * @param {any[][]} ports Struct for child processes' ports
 * @param {number} nConsumers Number of Consumers
 * @param {number} nProsumers Number of Prosumers
 */
function simulate(path, cps, children, ports, nConsumers, nProsumers){
    try{
        for(let i=0; i<5; i++){
            if(i<3){
                // Create children with the behavior specified in the file
                let childObject = spawn('node', [path + cps[i], ports[0][i]]);
                
                childObject.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });              
                
                children[0].push(childObject);
            }
            else if (i==3){
                for(let j=0; j<nConsumers; j++){
                    // Generate new consumer port
                    let calcPort = 4004 + Math.floor(Math.random() * 1000)
                    ports[1].push(calcPort.toString());
                    
                    // Create children with the behavior specified in the file
                    let childObject = spawn('node', [path + cps[i], ports[1][j]]);
    
                    childObject.stderr.on('data', (data) => {
                        console.error(`stderr: ${data}`);
                    });       
    
                    children[1].push(childObject);
                }
            }
            else{
                for(let j=0; j<nProsumers; j++){
                    // Generate new prosumer port
                    let calcPort = 5004 + Math.floor(Math.random() * 1000)
                    ports[2].push(calcPort.toString());         

                    // Create children with the behavior specified in the file 
                    let childObject = spawn('node', [path + cps[i], ports[2][j]]);
                      
                    childObject.stderr.on('data', (data) => {
                        console.error(`stderr: ${data}`);
                    });       
    
                    children[2].push(childObject);
                }
            }
        }
    } catch (err) {
        console.error(err)
    }

    /**
     * Kill all child processes if the parent is exiting
     */
    function killChildren(){
        for(let i=0; i<5; i++){
            if(i<3){
                children[0][i].kill('SIGTERM');
            }
            else if (i==3){
                for(let j=0; j<nConsumers; j++){
                    children[1][j].kill('SIGTERM');
                }
            }
            else{
                for(let j=0; j<nProsumers; j++){
                    children[2][j].kill('SIGTERM');
                }
            }
        }
    }
    process.on('exit',  killChildren);
}

module.exports = simulate;