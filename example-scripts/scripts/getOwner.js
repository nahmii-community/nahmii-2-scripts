const ethers = require('ethers')
const { networks } = require('../utils/networks')

async function main() {
    const ABI = ['function owner() view returns (address)']
    // The contract address of an address that implements ownable.
    const CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000002'

    // Set up our L2 RPC provider connection.
    // Switching networks can be done by replacing `networks.*.{l1,l2}` by either mainnet, testnet or localhost.
    const RPC_PROVIDER = new ethers.providers.JsonRpcProvider(networks.mainnet.l2)

    // Setup the Ownable contract interface and construct an Ethers Contract around it.
    const Ownable = new ethers.Contract(
        CONTRACT_ADDRESS, // Ownable contract address.
        ABI,
        RPC_PROVIDER
    )

    // Check the status of arbitrary deployments.
    console.log(`Contract owner: ${await Ownable.owner()}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })