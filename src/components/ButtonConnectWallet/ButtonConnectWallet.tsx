import { Box, Button } from '@mui/material';
import React from 'react';
import { useWalletData, useWalletFunction } from 'src/states/wallet';
import { formatAddress } from 'src/utils/format';

export default function ButtonConnectWallet() {
    const { userAddress, isConnecting } = useWalletData();
    const { connectWallet } = useWalletFunction();

    return (
        <Box ml={'auto'}>
            {isConnecting ? (
                <Button variant="outlined" sx={{ borderRadius: '5px 12px 5px 12px', textTransform: 'none' }} disabled color="success">
                    Connecting...
                </Button>
            ) : (
                <>
                    {userAddress ? (
                        <Button variant="outlined" sx={{ borderRadius: '5px 12px 5px 12px', textTransform: 'none' }} color="success">
                            {formatAddress(userAddress)}
                        </Button>
                    ) : (
                        <Button variant="outlined" sx={{ borderRadius: '5px 12px 5px 12px', textTransform: 'capitalize' }} color="success" onClick={connectWallet}>
                            Connect wallet
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
}
