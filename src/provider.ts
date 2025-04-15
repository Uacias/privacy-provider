type CircuitInfo = {
  name: string;
  jsonUrl: string;
  vkUrl: string;
};

type Message =
  | { type: 'SET_SEED'; seed: string }
  | { type: 'GET_SEED' }
  | { type: 'POSEIDON'; inputs: bigint[] }
  | { type: 'GENERATE_OPERATION'; metadata: any }
  | { type: 'CONFIRM_OPERATION'; id: number }
  | { type: 'ABORT_OPERATION'; id: number }
  | { type: 'NULLIFY_OPERATION'; id: number }
  | { type: 'EXECUTE_TRANSACTION'; body: any }
  | { type: 'GET_TRANSACTION_FEE_DATA'; body: any }
  | { type: 'GET_PROOF_DATA'; body: any }
  | { type: 'GET_TOKEN_NAME'; tokenAddress: string }
  | { type: 'GET_TOKEN_DECIMALS'; tokenAddress: string }
  | {
      type: 'GENERATE_PROOF';
      circuit: CircuitInfo;
      witnessInput: any;
    }
  | { type: 'GET_CONFIRMED_OPERATIONS' };

export class PrivacyProvider {
  private async api(): Promise<PrivacyAPI> {
    if (typeof window === 'undefined') throw new Error('Not running in browser');
    if (window.privacy) return window.privacy;

    return new Promise((resolve, reject) => {
      const start = Date.now();

      function check() {
        if (window.privacy) {
          resolve(window.privacy);
        } else if (Date.now() - start > 5000) {
          reject(new Error('Privacy API not available'));
        } else {
          setTimeout(check, 50);
        }
      }

      check();
    });
  }

  async request<T = any>(msg: Message): Promise<T> {
    const api = await this.api();
    return await api.request(msg);
  }

  async setSeed(seed: string) {
    return this.request({ type: 'SET_SEED', seed });
  }

  async getSeed() {
    return this.request<{ seed: string | null }>({ type: 'GET_SEED' });
  }

  async poseidonHash(inputs: bigint[]): Promise<{ hash: string }> {
    return this.request({
      type: 'POSEIDON',
      inputs
    });
  }

  async generateOperation(metadata: any) {
    return this.request<{ hash: string; id: number }>({
      type: 'GENERATE_OPERATION',
      metadata
    });
  }

  async confirmOperation(id: number) {
    return this.request({ type: 'CONFIRM_OPERATION', id });
  }

  async abortOperation(id: number) {
    return this.request({ type: 'ABORT_OPERATION', id });
  }

  async nullifyOperation(id: number) {
    return this.request({ type: 'NULLIFY_OPERATION', id });
  }

  async getConfirmedOperations() {
    return this.request<{ operations: any[] }>({
      type: 'GET_CONFIRMED_OPERATIONS'
    });
  }

  async exetuceTransacion(body: any) {
    return this.request({ type: 'EXECUTE_TRANSACTION', body });
  }

  async getProofData(body: any) {
    return this.request({ type: 'GET_PROOF_DATA', body });
  }

  async getFeeData(body: any) {
    return this.request({ type: 'GET_TRANSACTION_FEE_DATA', body });
  }

  async getTokenName(tokenAddress: string) {
    return this.request({ type: 'GET_TOKEN_NAME', tokenAddress });
  }

  async getTokenDecimals(tokenAddress: string) {
    return this.request({ type: 'GET_TOKEN_DECIMALS', tokenAddress });
  }

  async generateProof({ circuit, witnessInput }: { circuit: CircuitInfo; witnessInput: any }) {
    return this.request({
      type: 'GENERATE_PROOF',
      circuit,
      witnessInput
    });
  }
}
