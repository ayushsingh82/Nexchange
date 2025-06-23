// Okto API utility functions

const OKTO_BASE_URL = 'https://sandbox-api.okto.tech/api/oc/v1';

// 1. Handles user authentication via Google OAuth
export async function authenticateWithGoogle(idToken: string) {
  const res = await fetch(`${OKTO_BASE_URL}/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error('Failed to authenticate');
  return res.json();
}

// 2. Signs messages following the EIP191 standard
export async function signEIP191Message(accessToken: string, message: string) {
  const res = await fetch(`${OKTO_BASE_URL}/sign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to sign message');
  return res.json();
}

// 3. Handles token transfers between addresses
export async function transferToken(accessToken: string, params: any) {
  // params: { from, to, tokenAddress, amount, ... }
  const res = await fetch(`${OKTO_BASE_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ type: 'token_transfer', ...params }),
  });
  if (!res.ok) throw new Error('Failed to transfer token');
  return res.json();
}

// 4. Handles custom EVM transactions with specified parameters
export async function executeCustomEvmTx(accessToken: string, params: any) {
  // params: { to, data, value, gas, ... }
  const res = await fetch(`${OKTO_BASE_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ type: 'custom_evm_tx', ...params }),
  });
  if (!res.ok) throw new Error('Failed to execute custom EVM tx');
  return res.json();
}

// 5. Executes token swap operations
export async function executeTokenSwap(accessToken: string, params: any) {
  // params: { fromToken, toToken, amount, ... }
  const res = await fetch(`${OKTO_BASE_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ type: 'token_swap', ...params }),
  });
  if (!res.ok) throw new Error('Failed to execute token swap');
  return res.json();
}

// 6. Get the portfolio data of the user
export async function getPortfolio(accessToken: string) {
  const res = await fetch(`${OKTO_BASE_URL}/aggregated-portfolio`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
}

// 7. Fetch all the orders of the user
export async function getOrders(accessToken: string) {
  const res = await fetch(`${OKTO_BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}
