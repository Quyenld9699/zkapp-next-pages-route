import { Box, Typography } from '@mui/material';
import { useThemeData } from 'src/states/theme';
import ViewHome from 'src/views/Home/Home';

export default function Home() {
    const [theme] = useThemeData();
    return (
        <Box>
            <Typography variant="h1">Hello world</Typography>
            <Typography>Theme: {theme}</Typography>
        </Box>
    );
}
