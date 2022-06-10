const { balanceOfERC20 } = require('@nahmii/sdk')
const ethers = require('ethers')
const { networks } = require('../utils/networks')

async function main() {
    // Set up our RPC provider connections.
    // Switching networks can be done by replacing `networks.*.{l1,l2}` by either mainnet, testnet or localhost.
    const l1RpcProvider = new ethers.providers.JsonRpcProvider(networks.testnet.l1)
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(networks.testnet.l2)

    // Use either the private key or the public address to check a given ERC20 token balance on both L1 or L2.
    const key = ''
    const address = ''
    let l1Wallet, l2Wallet

    // L1 and L2 (bridged) token address.
    const l1TokenAddress = '0x11ca3411f42a7f6c8ca3a1ef5f8045893ff0bba5' // Ropsten NUSD address
    const l2TokenAddress = '0xab151cD390C6b0eB41A4a45E1E372972C3067b1a' // Testnet NUSD address

    if (address) {
        l1Wallet = new ethers.VoidSigner(address, l1RpcProvider)
        l2Wallet = new ethers.VoidSigner(address, l2RpcProvider)
    } else {
        l1Wallet = new ethers.Wallet(key, l1RpcProvider)
        l2Wallet = new ethers.Wallet(key, l2RpcProvider)
    }

    // Retrieve ERC20 balances on both L1 and L2. 
    const l1ERC20Balance = await balanceOfERC20(l1TokenAddress, address, l1Wallet)
    const l2ERC20Balance = await balanceOfERC20(l2TokenAddress, address, l2Wallet)

    // Log ERC20 currency balance for L1 for a given address or wallet.
    console.log(`Balance on L1: ${l1ERC20Balance}`)
    // Log ERC20 currency balance for L2 for a given address or wallet.
    console.log(`Balance on L2: ${l2ERC20Balance}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
