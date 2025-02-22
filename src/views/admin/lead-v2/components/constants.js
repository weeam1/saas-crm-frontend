// export const leadlabelFontSize = '0.5rem'; // 8px = 0.5rem
// export const leadValueFontSize = '0.625rem'; // 10px = 0.625rem
// export const leadIconSize = '0.625rem'; // 10px = 0.625rem

export const leadSelectInputSize = 'xs'; // md, lg, sm
// export const leadSelectInputFontSize = '0.625rem'; // 10px = 0.625rem
// export const leadlabelFontSize = 'clamp(0.5rem, min(1vw, 0.5rem), 0.75rem)';
// // 8px (large screens) → scales down on mid-sized → increases to 12px on XL screens

// export const leadValueFontSize =
// 	'clamp(0.625rem, min(1.2vw, 0.625rem), 0.875rem)';
// // 10px (large screens) → scales down on mid-sized → increases to 14px on XL screens

// export const leadIconSize = 'clamp(0.625rem, min(1.2vw, 0.625rem), 0.875rem)';
// // 10px (large screens) → scales down on mid-sized → increases to 14px on XL screens

// export const leadSelectInputFontSize =
// 	'clamp(0.625rem, min(1.2vw, 0.625rem), 0.875rem)';

export const leadlabelFontSize =
	'clamp(0.625rem, min(1vw, 0.625rem), 0.875rem)';
// 10px (large screens) → scales down on mid-sized → increases to 14px on XL screens

export const leadValueFontSize = 'clamp(0.75rem, min(1.2vw, 0.75rem), 1rem)';
// 12px (large screens) → scales down on mid-sized → increases to 16px on XL screens

export const leadIconSize = 'clamp(0.75rem, min(1.2vw, 0.75rem), 1rem)';
// 12px (large screens) → scales down on mid-sized → increases to 16px on XL screens

export const leadSelectInputFontSize =
	'clamp(0.75rem, min(1.2vw, 0.75rem), 1rem)';
// 12px (large screens) → scales down on mid-sized → increases to 16px on XL screens

export const mergeSort = (arr) => {
	if (arr.length <= 1) return arr;

	const mid = Math.floor(arr.length / 2);
	const left = mergeSort(arr.slice(0, mid));
	const right = mergeSort(arr.slice(mid));

	return merge(left, right);
};

const merge = (left, right) => {
	let sortedArr = [];
	let i = 0,
		j = 0;

	while (i < left.length && j < right.length) {
		if (left[i].firstName.localeCompare(right[j].firstName) <= 0) {
			sortedArr.push(left[i]);
			i++;
		} else {
			sortedArr.push(right[j]);
			j++;
		}
	}

	return [...sortedArr, ...left.slice(i), ...right.slice(j)];
};
