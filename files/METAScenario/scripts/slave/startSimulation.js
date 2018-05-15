const WebSocket = require('ws')
const execa = require("execa")

function receiveContractAddress() {
    var ws
    ws = new WebSocket('ws://eth_contract_deployer:40000')
    ws.on('message', function incoming(address) {
        console.log("-------------------------Address-------------")
        console.log(address)
        generateCoins(address)
        require("./runTransactionSlave")(address)
    })
    ws.onerror = function (event) {
        console.log("Contract address WebSocket not reachable");
        ws.close()
    }

    ws.onclose = function (event) {
        setTimeout(function () {
            receiveContractAddress()
        }, 10000)
    }

}

function generateCoins(address) {

    return execa('truffle', ['exec', 'generateCoins.js', address, '--network=dev']).catch(function () {
        setTimeout(function () {
            generateCoins(address)
        }, 10000)
    })

}

receiveContractAddress()
