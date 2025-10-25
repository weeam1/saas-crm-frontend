import { Text, Link } from '@chakra-ui/react';
const URL_REGEX = /((https?:\/\/|www\.)[^\s]+)/g;

const ChatContentPreview = ({ children }) => {
	const parts = children.split(URL_REGEX);

	return (
		<Text whiteSpace='pre-wrap' wordBreak='break-word'>
			{parts.map((part, index) => {
				if (URL_REGEX.test(part)) {
					const url = part.startsWith('http') ? part : `https://${part}`;
					return (
						<Link
							key={index}
							href={url}
							isExternal
							color='blue.500'
							textDecoration='underline'
							mr='1'
						>
							{part}
						</Link>
					);
				} else {
					return <span key={index}>{part}</span>;
				}
			})}
		</Text>
	);
};

export default ChatContentPreview;
