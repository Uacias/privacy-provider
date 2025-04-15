# 🕵️‍♂️ PrivacyProvider

`PrivacyProvider` is a lightweight wrapper for interacting with the Privacy Extension.  
It allows frontend apps to communicate securely with the extension and request actions like generating zk-proofs, preparing transactions, fetching token metadata, and more.

---

## 🚀 Installation

```bash
npm install privacy-provider
```

---

## 📦 Usage

```ts
import { privacy } from 'privacy-provider';

const { id, hash } = await privacy.generateOperation({
  amount: '1000000000000000000',
  tokenAddress: '0x123...abc',
  type: 'deposit'
});

await privacy.confirmOperation(id);
```

---

## 🧠 API Overview

All methods are async and return a Promise.

### `setSeed(seed: string)`

Stores a decrypted seed securely in memory.

### `getSeed()`

Returns the currently unlocked seed:

```ts
{
  seed: string | null;
}
```

---

### `generateOperation(metadata: any)`

Creates a new private operation (deposit, transfer, etc.) from the seed.
Stores it as `pending`.

Returns:

```ts
{
  hash: string;
  id: string;
}
```

---

### `confirmOperation(id: string)`

Moves a `pending` operation to the `confirmed` list.
Should be called after a successful on-chain transaction.

---

### `abortOperation(id: string)`

Cancels a `pending` operation and marks it as `aborted`.

---

### `nullifyOperation(id: string)`

Marks a `confirmed` operation as `nullified`, e.g., after a `withdraw`.

---

### `getConfirmedOperations()`

Returns all confirmed operations for the current seed:

```ts
{ operations: any[] }
```

---

### `executeTransaction(body: any)`

Sends a POST request to the Privacy Pools backend to execute a transaction.

```ts
await privacy.exetuceTransacion({
  calldata: '0x...',
  address: '0xYourAccountContract'
});
```

Returns:

```ts
{
  hash: string;
}
```

---

### `getProofData(body: any)`

Fetches Merkle paths and related inputs needed to generate a proof.

Returns:

```ts
{
  data: any;
}
```

---

### `getFeeData(body: any)`

Fetches estimated fees (e.g., paymaster fee, gas) for a transaction.

Returns:

```ts
{
  data: any;
}
```

---

### `getTokenName(tokenAddress: string)`

Returns the human-readable name of a token from its Starknet address.

```ts
const name = await privacy.getTokenName('0xabc...');
```

---

### `getTokenDecimals(tokenAddress: string)`

Returns the number of decimals of a token.

---

### `generateProof({ circuit, witnessInput })`

Generates a SNARK proof using Noir + Garaga + ACVM in the extension's offscreen document.

```ts
const proof = await privacy.generateProof({
  circuit: {
    name: 'withdraw',
    jsonUrl: 'https://.../withdraw.json',
    vkUrl: 'https://.../vk.bin'
  },
  witnessInput: {
    amount: '1000000000000000000',
    nullifier: '...',
    ...
  }
});
```

Returns:

```ts
{
  proof: string;
} // Honk calldata hex
```

---

## 🧩 Under the Hood

All requests are sent to the Chrome Extension through `window.privacy.request(...)`.  
The extension stores seed in `chrome.storage.session`, handles state of operations, and manages proof generation securely in an offscreen document.

---

## ❗ Requirements

- The user must have the Privacy Extension installed and unlocked.
- The frontend must be served in a browser environment (not SSR).
- Circuit artifacts (`.json`, `vk.bin`) must be publicly accessible URLs.

---

## 🧪 Example

```ts
const { id, hash } = await privacy.generateOperation({ type: 'deposit', amount, tokenAddress });
await privacy.confirmOperation(id);

const proof = await privacy.generateProof({
  circuit: {
    name: 'withdraw',
    jsonUrl: 'https://yourcdn.com/circuits/withdraw.json',
    vkUrl: 'https://yourcdn.com/circuits/withdraw.vk.bin'
  },
  witnessInput: {
    nullifier: '...',
    secret: '...',
    amount: '...',
    token: '...'
  }
});
```

---

## 📄 License

MIT – © [Uacias](https://github.com/Uacias)
