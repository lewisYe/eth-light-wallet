import { ethers } from 'ethers';

declare class DataEncryption {
    currentKey: string;
    serverPubKey: string;
    constructor();
    get aseKey(): string;
    setPublicKey(key: string): void;
    randomKey(length?: number): string;
    /**
     * 获取加密后 ase 密钥
     * @returns string
     */
    getEncryptKey(): string | false;
    /**
     * 综合加密
     * @param {*} 加密数据
     * @returns key: 密钥，ciphertext: 密文
     */
    encrypt(plaintext: any): {
        key: string | false;
        ciphertext: string;
    } | {
        key?: undefined;
        ciphertext?: undefined;
    };
    decrypt(data: string): any;
}
declare const dataEncryption: DataEncryption;

interface ChainInfo {
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
interface CallbackParams {
    type: 'accountsChanged' | 'chainChanged';
    value: string;
}
declare function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object;
declare const connect: (switchChainId?: string) => Promise<{
    account: any;
    chainId: any;
}>;
declare const switchChain: (chainId: string, callback?: () => void) => Promise<void>;
declare const getNetwork: () => Promise<ethers.providers.Network>;
declare function getSigner(): ethers.Signer | undefined;
declare const getWalletAddress: () => Promise<string | undefined>;
declare function isConnected(): any;
declare function hasWallet(): boolean;
declare function isMetaMask(): boolean;
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
declare function produceMessage(domain: string, address: string, statement: string, uri: string, version: number, nonce: Nonce, chainId?: number, requestId?: string, resources?: never[]): Promise<string>;
/**
 * Create a new nonce.
 *
 * @param {number|null} [expirationTTLSeconds] - Number of seconds the nonce should be valid for.
 * @param {Data|null} [notBefore] - The date, before which, the request should not be valid.
 * @returns {Nonce} - The requested nonce.
 */
declare function makeNonce(expirationTTLSeconds?: null, notBefore?: null): Promise<{
    value: string;
    issuedAt: Date;
    expirationTime: any;
    notBefore: null;
}>;

export { CallbackParams, ChainInfo, connect, dataEncryption, getNetwork, getSigner, getWalletAddress, hasWallet, isConnected, isMetaMask, isValidKey, makeNonce, produceMessage, switchChain };
