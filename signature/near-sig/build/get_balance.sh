#!/bin/bash

ACCOUNT="nexchangenear.near"
CONTRACTS=("usdt.tether-token.near" "wrap.near" "meta-pool.near" "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1")

for c in "${CONTRACTS[@]}"
do
  near call $c ft_balance_of '{"account_id":"'"$ACCOUNT"'"}' --accountId $ACCOUNT --network-id mainnet
done

echo "All balances fetched."
