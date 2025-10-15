// export function getMediaLabelFromMimeType(mimeType = '') {
// 	if (!mimeType) {
// 		return { type: 'unknown', label: 'Unknown File', ext: '', icon: '❓' };
// 	}

// 	const typeMap = [
// 		// 🖼️ Images
// 		{
// 			match: /^image\//,
// 			type: 'image',
// 			label: 'Image',
// 			ext: '.jpg',
// 			icon: '🖼️',
// 		},

// 		// 🎬 Videos
// 		{
// 			match: /^video\//,
// 			type: 'video',
// 			label: 'Video',
// 			ext: '.mp4',
// 			icon: '🎬',
// 		},

// 		// 🎵 Audio
// 		{
// 			match: /^audio\//,
// 			type: 'audio',
// 			label: 'Audio',
// 			ext: '.mp3',
// 			icon: '🎵',
// 		},

// 		// 📄 PDF
// 		{
// 			match: 'application/pdf',
// 			type: 'document',
// 			label: 'PDF Document',
// 			ext: '.pdf',
// 			icon: '📄',
// 		},

// 		// 📝 Word Documents
// 		{
// 			match: /(msword|officedocument\.wordprocessingml)/,
// 			type: 'document',
// 			label: 'Word Document',
// 			ext: '.docx',
// 			icon: '📝',
// 		},

// 		// 📊 Excel Sheets
// 		{
// 			match: /(spreadsheetml|ms-excel)/,
// 			type: 'document',
// 			label: 'Excel Spreadsheet',
// 			ext: '.xlsx',
// 			icon: '📊',
// 		},

// 		// 🖥️ PowerPoint Presentations
// 		{
// 			match: /(presentationml|ms-powerpoint)/,
// 			type: 'document',
// 			label: 'PowerPoint Presentation',
// 			ext: '.pptx',
// 			icon: '🖥️',
// 		},

// 		// 📄 Plain Text / JSON
// 		{
// 			match: /(text\/plain|application\/json)/,
// 			type: 'document',
// 			label: 'Text File',
// 			ext: '.txt',
// 			icon: '📄',
// 		},

// 		// 📦 ZIP / RAR / 7z Archives
// 		{
// 			match: /(zip|x-zip-compressed)/,
// 			type: 'archive',
// 			label: 'ZIP Archive',
// 			ext: '.zip',
// 			icon: '📦',
// 		},
// 		{
// 			match: /(x-rar|rar)/,
// 			type: 'archive',
// 			label: 'RAR Archive',
// 			ext: '.rar',
// 			icon: '📦',
// 		},
// 		{
// 			match: /(x-7z-compressed)/,
// 			type: 'archive',
// 			label: '7z Archive',
// 			ext: '.7z',
// 			icon: '📦',
// 		},

// 		// ⚙️ APK / Executables
// 		{
// 			match: /(vnd\.android\.package-archive|x-msdownload)/,
// 			type: 'binary',
// 			label: 'Executable File',
// 			ext: '.apk',
// 			icon: '⚙️',
// 		},

// 		// 🌐 HTML / XML / Web
// 		{
// 			match: /(text\/html|application\/xml)/,
// 			type: 'document',
// 			label: 'Web Document',
// 			ext: '.html',
// 			icon: '🌐',
// 		},

// 		// Generic Office
// 		{
// 			match: /officedocument/,
// 			type: 'document',
// 			label: 'Office Document',
// 			ext: '.docx',
// 			icon: '📄',
// 		},
// 	];

// 	const found = typeMap.find((entry) =>
// 		entry.match instanceof RegExp
// 			? entry.match.test(mimeType)
// 			: mimeType.includes(entry.match)
// 	);

// 	return (
// 		found || { type: 'unknown', label: 'Unknown File', ext: '', icon: '❓' }
// 	);
// }

import {
	FaFilePdf,
	FaFileWord,
	FaFileExcel,
	FaFilePowerpoint,
	FaFileImage,
	FaFileVideo,
	FaFileAudio,
	FaFileArchive,
	FaFileCode,
	FaFileAlt,
	FaAndroid,
	FaFile,
} from 'react-icons/fa';

export function getMediaTypeInfo(mimeType = '') {
	if (!mimeType) {
		return {
			type: 'unknown',
			label: 'Unknown File',
			ext: '',
			color: 'gray.400',
			icon: FaFile,
		};
	}

	const map = [
		// 🖼️ Images
		{
			match: /^image\//,
			type: 'image',
			label: 'Image',
			ext: '.jpg',
			color: 'blue.400',
			icon: FaFileImage,
		},

		// 🎬 Videos
		{
			match: /^video\//,
			type: 'video',
			label: 'Video',
			ext: '.mp4',
			color: 'purple.400',
			icon: FaFileVideo,
		},

		// 🎵 Audio
		{
			match: /^audio\//,
			type: 'audio',
			label: 'Audio',
			ext: '.mp3',
			color: 'teal.400',
			icon: FaFileAudio,
		},

		// 📄 PDF
		{
			match: 'application/pdf',
			type: 'document',
			label: 'PDF Document',
			ext: '.pdf',
			color: 'red.400',
			icon: FaFilePdf,
		},

		// 📝 Word
		{
			match: /(msword|officedocument\.wordprocessingml)/,
			type: 'document',
			label: 'Word Document',
			ext: '.docx',
			color: 'blue.500',
			icon: FaFileWord,
		},

		// 📊 Excel
		{
			match: /(spreadsheetml|ms-excel)/,
			type: 'document',
			label: 'Excel Spreadsheet',
			ext: '.xlsx',
			color: 'green.500',
			icon: FaFileExcel,
		},

		// 🖥️ PowerPoint
		{
			match: /(presentationml|ms-powerpoint)/,
			type: 'document',
			label: 'PowerPoint Presentation',
			ext: '.pptx',
			color: 'orange.400',
			icon: FaFilePowerpoint,
		},

		// 📦 ZIP / RAR / 7z
		{
			match: /(zip|x-zip-compressed)/,
			type: 'archive',
			label: 'ZIP Archive',
			ext: '.zip',
			color: 'yellow.500',
			icon: FaFileArchive,
		},
		{
			match: /(x-rar|rar)/,
			type: 'archive',
			label: 'RAR Archive',
			ext: '.rar',
			color: 'yellow.500',
			icon: FaFileArchive,
		},
		{
			match: /(x-7z-compressed)/,
			type: 'archive',
			label: '7z Archive',
			ext: '.7z',
			color: 'yellow.500',
			icon: FaFileArchive,
		},

		// ⚙️ APK / Executables
		{
			match: /(vnd\.android\.package-archive|x-msdownload)/,
			type: 'binary',
			label: 'Executable File',
			ext: '.apk',
			color: 'gray.500',
			icon: FaAndroid,
		},

		// 💻 Code / JSON / Plain text
		{
			match: /(text\/plain|application\/json|text\/html|application\/xml)/,
			type: 'document',
			label: 'Code/Text File',
			ext: '.txt',
			color: 'cyan.400',
			icon: FaFileCode,
		},
	];

	const found = map.find((entry) =>
		entry.match instanceof RegExp
			? entry.match.test(mimeType)
			: mimeType.includes(entry.match)
	);

	return (
		found || {
			type: 'unknown',
			label: 'Unknown File',
			ext: '',
			color: 'gray.400',
			icon: FaFileAlt,
		}
	);
}
