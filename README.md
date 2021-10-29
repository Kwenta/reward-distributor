# Reward Distributooor

Script for distributing ERC20 rewards. Current implementation tailored for the Futures Competition SNX rewards. 

**Note: Requires ETH in distributor wallet. If distributing more than 100 rewards consider using a merkle distributor.**

### Example ENV
```
DISTRIBUTION_WALLET=0xPRIVATE_KEY_HERE
```

### Testing

```
npm test
```

### Distributing

```
npm run build
npm run distribute
```
