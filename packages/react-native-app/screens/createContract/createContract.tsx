import WalletConnect from "@walletconnect/client";
import Web3 from "web3";
import contractFile from './contract/GreeterContract.json';
import { blockChainAddress } from '../../constants';

// https://docs.moonbeam.network/builders/build/eth-api/libraries/web3js/#deploy-a-contract

const createContract = async (connector: WalletConnect) => {

    const web3 = new Web3(blockChainAddress);

    const publicKey = connector.accounts[0]

    const bytecode = contractFile.evm.bytecode.object;
    const abi = contractFile.abi;

    const contract = new web3.eth.Contract(abi as any);

    const contractTx = contract.deploy({
        data: bytecode,
        arguments: [5],
    });

    const createTransaction = await connector.signTransaction(
        {
            data: contractTx.encodeABI(),
            gas: await contractTx.estimateGas(),
            from: publicKey
        },
    );

    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.raw);

    return createReceipt.contractAddress
};

export default createContract