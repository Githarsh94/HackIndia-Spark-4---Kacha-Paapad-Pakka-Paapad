import { FilecoinProvider } from 'filecoin-wallet-provider';

async function storeOnFilecoin(cid) {
    const provider = new FilecoinProvider();
    const result = await provider.store(cid);
    return result;
}

export default { storeOnFilecoin };
