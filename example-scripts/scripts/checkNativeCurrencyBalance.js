const ethers = require('ethers')
const { networks } = require('../utils/networks')

async function main() {
    // Set up our RPC provider connections.
    // Switching networks can be done by replacing `networks.*.{l1,l2}` by either mainnet, testnet or localhost.
    const l1RpcProvider = new ethers.providers.JsonRpcProvider(networks.mainnet.l1)
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(networks.mainnet.l2)

    // Use either the private key or the public address to check the native currency token on both L1 or L2.
    const key = ''
    const address = ''
    let l1Wallet, l2Wallet

    if (address) {
        l1Wallet = new ethers.VoidSigner(address, l1RpcProvider)
        l2Wallet = new ethers.VoidSigner(address, l2RpcProvider)
    } else {
        l1Wallet = new ethers.Wallet(key, l1RpcProvider)
        l2Wallet = new ethers.Wallet(key, l2RpcProvider)
    }

    // Initial balances.
    console.log(`Balance on L1: ${await l1RpcProvider.getBalance(l1Wallet.address)}`)
    console.log(`Balance on L2: ${await l2RpcProvider.getBalance(l2Wallet.address)}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
