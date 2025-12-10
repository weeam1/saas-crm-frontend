import { useState } from 'react';
import {
	Input,
	InputGroup,
	Icon,
	InputRightElement,
	Button,
} from '@chakra-ui/react';

import { FaEye, FaEyeSlash } from 'react-icons/fa6';

function PasswordInput({
	password: [pass, setPass],
	placeHolder,
	isRequired = false,
}) {
	const [showPassword, setShowPassword] = useState(false);
	const handleClick = () => setShowPassword(!showPassword);

	return (
		<InputGroup size='md'>
			<Input
				pr='4.5rem'
				type={showPassword ? 'text' : 'password'}
				placeholder={placeHolder || ''}
				value={pass}
				isRequired
				onChange={(e) => setPass(e.target.value)}
			/>
			<InputRightElement width='4.5rem'>
				<Button h='1.75rem' size='sm' onClick={handleClick} variant='unstyled'>
					<Icon as={showPassword ? FaEyeSlash : FaEye} />
				</Button>
			</InputRightElement>
		</InputGroup>
	);
}

export default PasswordInput;
