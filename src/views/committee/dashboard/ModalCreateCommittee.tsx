import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react';

export default function ModalCreateCommittee() {
    return (
        <Box>
            <TextField variant="outlined" label="Name" type="text" name="name_committee" />
            <br />
            <br />
            <Box sx={{ display: 'flex', placeItems: 'center' }}>
                <TextField variant="outlined" label="Creator" type="text" name="creator_committee" sx={{ mr: 5 }} />

                <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="create-committee-label">Network</InputLabel>
                    <Select labelId="create-committee-label" label="Network">
                        <MenuItem value={1}>Berkery</MenuItem>
                        <MenuItem value={2}>Devnet</MenuItem>
                        <MenuItem value={3}>Mainnet</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box mt={3}>
                <Typography mb={2}>{'Usage Threshold (T out of N)'}</Typography>
                <TextField variant="outlined" label="T" type="text" name="t_committee" sx={{ width: '150px', mr: 3 }} />
                <TextField variant="outlined" label="N" type="text" name="n_committee" sx={{ width: '150px' }} />
            </Box>

            <Box mt={3}>
                <Typography mb={2}>{'Committee Members (Mina Address)'}</Typography>
                <TextField fullWidth variant="outlined" label="#1" type="text" name="address_member_committee" sx={{ mb: 1 }} />
                <TextField fullWidth variant="outlined" label="#2" type="text" name="address_member_committee" />
            </Box>

            <Box mt={5} textAlign={'right'}>
                <Button variant="contained">Create</Button>
            </Box>
        </Box>
    );
}
