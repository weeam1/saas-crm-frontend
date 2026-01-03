import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useFormikContext } from 'formik';

function CurrencySelect({ currencies }) {
	const { values, setFieldValue } = useFormikContext();

	return (
		<FormControl w='100%'>
			<FormLabel
				htmlFor={'currency'}
				fontSize='sm'
				fontWeight='600'
				color='gray.700'
				mb='1'
			>
				Currency
			</FormLabel>
			<Select
				value={values.currency}
				onChange={(e) => setFieldValue('currency', e.target.value)}
				bg='gray.50'
				border={'1px solid'}
				borderColor='gray.300'
				_hover={{ borderColor: 'brand.400' }}
				_focus={{
					borderColor: 'brand.500',
					boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
				}}
				borderRadius={'md'}
				placeholder='Select currency'
			>
				{currencies?.length > 0 ? (
					currencies?.map((c) => (
						<option key={c.value} value={c.value}>
							{c.label}
						</option>
					))
				) : (
					<option value='' disabled style={{ color: '#e71a1aff' }}>
						Currenices loaded failed
					</option>
				)}
			</Select>
		</FormControl>
	);
}

export default CurrencySelect;
