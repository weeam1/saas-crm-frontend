import { useEffect } from 'react';
import { IconButton, HStack, Tooltip } from '@chakra-ui/react';
import { FaThLarge, FaTable } from 'react-icons/fa';

const icons = [
  { label: 'Grid View', icon: FaThLarge, value: 'grid' },
  { label: 'Table View', icon: FaTable, value: 'table' },
];

const ViewToggle = ({ view, handleView }) => {
  useEffect(() => {
    localStorage.setItem('employeesView', view);
  }, [view]);

  const renderButton = ({ label, icon: Icon, value }) => {
    const isActive = view === value;

    return (
      <Tooltip key={value} label={label} hasArrow>
        <IconButton
          aria-label={label}
          icon={<Icon size={12} />} // Smaller icon size
          size='xs' // Extra small size
          variant='ghost' // Always use ghost variant
          rounded='md'
          colorScheme='gray'
          onClick={() => handleView(value)}
          width={isActive ? '36px' : '30px'} // Wider when active
          height='24px' // Fixed height
          minW={isActive ? '36px' : '30px'} // Prevent content-based sizing
          bg={isActive ? 'gray.700' : 'transparent'}
          color={isActive ? 'white' : 'gray.600'}
          _active={{
            bg: 'gray.700',
            color: 'white',
            width: '36px'
          }}
          _hover={{
            bg: isActive ? 'gray.700' : 'gray.200',
            color: isActive ? 'white' : 'gray.700',
          }}
          transition='all 0.2s ease' // Smooth transitions
        />
      </Tooltip>
    );
  };

  return (
    <HStack 
      spacing={1} 
      bg='gray.50'
      px='1'
      py='1'
      rounded='md'
      height='32px' // More compact container
    >
      {icons.map(renderButton)}
    </HStack>
  );
};

export default ViewToggle;