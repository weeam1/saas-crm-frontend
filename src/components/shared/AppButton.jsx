import { Button, Spinner, useTheme } from '@chakra-ui/react';
import { cloneElement, forwardRef } from 'react';

const AppButton = forwardRef(
	(
		{
			children,
			isLoading = false,
			loadingText = 'Loading...',
			spinner,
			leftIcon,
			rightIcon,
			iconSpacing = '0.75rem',
			colorScheme = 'gray',
			size = { base: 'sm', md: 'md' },
			borderRadius = '5px',
			px = { base: 4, md: 6 },
			py = { base: 2, md: 3 },
			fontSize = { base: 'sm', md: 'md' },
			_focus = { boxShadow: 'outline' },
			...rest
		},
		ref
	) => {
		const theme = useTheme();
		const defaultSpinner = <Spinner size='sm' mr={2} />;

		const renderIcon = (icon) => {
			if (!icon) return null;
			return cloneElement(icon, {
				boxsize: icon.props.boxsize || theme.sizes[4],
			});
		};

		return (
			<Button
				ref={ref}
				colorScheme={colorScheme}
				size={size}
				borderRadius={borderRadius}
				px={px}
				py={py}
				fontSize={fontSize}
				_focus={_focus}
				isLoading={isLoading}
				loadingText={loadingText} // Only pass the text, no custom spinner here
				spinner={spinner} // Use the custom spinner if provided
				leftIcon={!isLoading ? renderIcon(leftIcon) : undefined}
				rightIcon={!isLoading ? renderIcon(rightIcon) : undefined}
				iconSpacing={iconSpacing}
				{...rest}
			>
				{!isLoading && children}
			</Button>
		);
	}
);

export default AppButton;
