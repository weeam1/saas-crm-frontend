import { useNavigate } from 'react-router-dom';
import { Box, SimpleGrid, Text, Icon } from '@chakra-ui/react';
import {
    FaTachometerAlt,
    FaClipboardList,
} from 'react-icons/fa';
const Sip = () => {
    const navigate = useNavigate();

    const allMenuItems = [
        {
            label: 'Dashboard',
            icon: FaTachometerAlt,
            route: '/sip/dashboard',
        },
        { label: 'history', icon: FaClipboardList, route: '/sip/history' },
    ];
    return (
        <>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} p={6}>
                {allMenuItems.map((item) => (
                    <Box
                        key={item.label}
                        p={6}
                        bg='white'
                        borderRadius='lg'
                        textAlign='center'
                        cursor='pointer'
                        _hover={{ bg: 'brand.400', color: 'white' }}
                        onClick={() => navigate(item.route)}
                    >
                        <Icon as={item.icon} boxSize={8} mb={2} />
                        <Text fontSize='md' fontWeight='bold'>
                            {item.label}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
        </>
    )
}
export default  Sip