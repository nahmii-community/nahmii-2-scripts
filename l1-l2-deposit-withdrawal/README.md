# L1 <-> L2 transfer

This example project showcases the programmatic flow of deposits and withdrawals. 

The example deploys a L1 ERC20 token, deploys a bridged version on L2, deposits this new token into L2 and starts the withdrawal procedure after depositing.

## How to run this project

The first step involves compiling the smart contract.

```sh
yarn && yarn run compile
```

The next step is to set the right parameters on the script, like updating the (private) key and picking the right network.

You can run the script by executing the following command:

```sh
node scripts/flow.js
```


### Switching network

Switching between mainnet and testnet can be done by changing line 19 and 20 to either use the `mainnet` or `testnet` network.

Furthermore, depending on the network, you have to enable either line 30 or 31.