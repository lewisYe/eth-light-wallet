import '@babel/polyfill'
import { Contract, ContractInterface, ethers, Signer } from 'ethers';
import { JsonRpcProvider, Web3Provider, BaseProvider } from '@ethersproject/providers';
import  dataEncryption from './dataEncryption';

const AddChainList = {
  '0x38': {
    chainId: '0x38', // A 0x-prefixed hexadecimal string
    chainName: 'Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB', // 2-6 characters long
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  '0x61': {
    chainId: '0x61', // A 0x-prefixed hexadecimal string
    chainName: 'Smart Chain - Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB', // 2-6 characters long
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
};

export interface ChainInfo {
  /**
   * 链ID的十六进制字符串。如：ETH -> "0x1"
   */
  chainId?: string;
  /**
   * 链 RPC 地址
   */
  rpc?: string;
  network?: 'homestead' | 'rinkeby' | 'ropsten' | 'kovan' | 'goerli';
}

export interface CallbackParams {
  type: 'accountsChanged' | 'chainChanged';
  value: string;
}

export function isValidKey(
  key: string | number | symbol,
  object: object,
): key is keyof typeof object {
  return key in object;
}
type CallbackFunctionType = (arg0: CallbackParams) => void;

export const connect = async (switchChainId?: string) => {
  if (hasWallet()) {
    // if(isConnected()) return;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      // 当前链 id 不等于 目前的链 id 执行切换
      if (switchChainId && chainId !== switchChainId) {
        switchChain(switchChainId);
      }

      return Promise.resolve({
        account: accounts[0],
        chainId,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  } else {
    throw new Error('window.ethereum is undefined')
  }
}

export const switchChain = async (chainId: string, callback?: () => void) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    callback?.();
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (error.code === 4902) {
      if (isValidKey(chainId, AddChainList)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [AddChainList[chainId]],
        });
        callback?.();
      }
    }
  }
}

export const getNetwork = async () => {
  if (hasWallet()) {
    const provider: Web3Provider = new ethers.providers.Web3Provider(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ethereum,
    );
    const network = await provider.getNetwork();
    return network;
  } else {
    throw new Error('window.ethereum is undefined');
  }
}

export function getSigner() {
  if (hasWallet()) {
    if (!isConnected()) {
      connect();
    }
    const provider: Web3Provider = new ethers.providers.Web3Provider(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ethereum,
    );
    const signer: Signer = provider.getSigner();
    return signer;
  } else {
    console.warn('window.ethereum is undefined');
  }
}

export const getWalletAddress = async () => {
  if (hasWallet()) {
    if (!isConnected()) {
      connect();
    }
    const provider: Web3Provider = new ethers.providers.Web3Provider(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ethereum,
    );
    const signer: Signer = provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } else {
    console.warn('window.ethereum is undefined');
  }
}


// 判断钱包是否链接
export function isConnected() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return window?.ethereum.isConnected() || false;
}

// 判断钱包是否存在
export function hasWallet() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(window.ethereum);
}

// 判断 MetaMask 的环境
export function isMetaMask() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
}

interface Nonce {
  value: string;
  issuedAt: Date;
  notBefore: Date | null;
  expirationTime: Date | null;
}
/**
 * Produce the EIP4361 Message for Wallet to Sign
 *
 * @param {string} domain - The domain making the request
 * @param {string} address - The address that should sign the request.
 * @param {string} statement - A statement for the user to agree to.
 * @param {string} uri - The URI making the request.
 * @param {number} version - The version making the request.
 * @param {Nonce} nonce - The nonce for this request.
 * @param {number|null} [chainId=null] - The chain ID for this request.
 * @param {string|null} [requestId=null] - The request ID associated with this request.
 * @param {string[]} [resources=[]] - An array of URIs for resources associated with the request.
 * @returns {string} - The message that the client should ask the wallet to sign with `personal_sign`.
 */
export function produceMessage(
  domain: string,
  address: string,
  statement: string,
  uri: string,
  version: number,
  nonce: Nonce,
  chainId?: number,
  requestId?: string,
  resources = [],
) {
  let message = `${statement}

URI: ${uri}
Version: ${version}
Nonce: ${nonce.value}
Issued At: ${nonce.issuedAt.toISOString()}`;

  if (nonce.expirationTime) {
    message += `\nExpiration Time: ${nonce.expirationTime.toISOString()}`;
  }
  if (nonce.notBefore) {
    message += `\nNot Before: ${nonce.notBefore.toISOString()}`;
  }
  if (chainId) {
    message += `\nChain ID: ${chainId}`;
  }
  if (requestId) {
    message += `\nRequest ID: ${requestId}`;
  }
  if (resources && resources.length) {
    message += '\nResources:';
    resources.forEach((resource) => {
      message += `\n- ${resource}`;
    });
  }
  return Promise.resolve(message);
}

/**
 * Create a new nonce.
 *
 * @param {number|null} [expirationTTLSeconds] - Number of seconds the nonce should be valid for.
 * @param {Data|null} [notBefore] - The date, before which, the request should not be valid.
 * @returns {Nonce} - The requested nonce.
 */
export function makeNonce(expirationTTLSeconds = null, notBefore = null) {
  const issuedAt = new Date();
  let expirationTime: any = null;
  if (expirationTTLSeconds) {
    expirationTime = new Date(issuedAt.getTime());
    expirationTime.setUTCSeconds(
      expirationTime.getUTCSeconds() + expirationTTLSeconds,
    );
  }
  const value = ethers.utils.hexlify(ethers.utils.randomBytes(16));
  return Promise.resolve({
    value,
    issuedAt,
    expirationTime,
    notBefore,
  });
}


export {
  dataEncryption
}