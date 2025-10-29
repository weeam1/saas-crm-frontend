import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import './DateRangePicker.css';

// Extend dayjs with required plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

const AdvancedDateRangePicker = ({
	initialStartDate = dayjs().subtract(1, 'month'),
	initialEndDate = dayjs(),
	onDateRangeChange,
	presets = true,
	showCustomRange = true,
	className = '',
	format = 'YYYY-MM-DD',
	minDate,
	maxDate,
	disabledDates = [],
	singleDate = false,
	closeOnSelect = false,
	placeholder = 'Select date range',
	i18n = {
		apply: 'Apply',
		cancel: 'Cancel',
		today: 'Today',
		yesterday: 'Yesterday',
		last7Days: 'Last 7 days',
		last30Days: 'Last 30 days',
		thisMonth: 'This month',
		lastMonth: 'Last month',
		customRange: 'Custom Range',
	},
	theme = {
		primaryColor: '#3b82f6',
		backgroundColor: '#ffffff',
		textColor: '#374151',
		borderColor: '#d1d5db',
		hoverColor: '#f3f4f6',
		selectedColor: '#3b82f6',
		rangeColor: '#dbeafe',
		disabledColor: '#9ca3af',
	},
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [startDate, setStartDate] = useState(initialStartDate);
	const [endDate, setEndDate] = useState(initialEndDate);
	const [tempStartDate, setTempStartDate] = useState(initialStartDate);
	const [tempEndDate, setTempEndDate] = useState(initialEndDate);
	const [currentMonth, setCurrentMonth] = useState(dayjs());
	const [hoverDate, setHoverDate] = useState(null);
	const [activePreset, setActivePreset] = useState(null);

	const pickerRef = useRef(null);

	// Apply custom CSS variables
	useEffect(() => {
		const root = document.documentElement;
		root.style.setProperty('--primary-color', theme.primaryColor);
		root.style.setProperty('--background-color', theme.backgroundColor);
		root.style.setProperty('--text-color', theme.textColor);
		root.style.setProperty('--border-color', theme.borderColor);
		root.style.setProperty('--hover-color', theme.hoverColor);
		root.style.setProperty('--selected-color', theme.selectedColor);
		root.style.setProperty('--range-color', theme.rangeColor);
		root.style.setProperty('--disabled-color', theme.disabledColor);
	}, [theme]);

	// Close picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Handle preset selection
	const handlePresetSelect = (preset) => {
		let newStartDate, newEndDate;

		switch (preset) {
			case 'today':
				newStartDate = dayjs();
				newEndDate = dayjs();
				break;
			case 'yesterday':
				newStartDate = dayjs().subtract(1, 'day');
				newEndDate = dayjs().subtract(1, 'day');
				break;
			case 'last7Days':
				newStartDate = dayjs().subtract(6, 'day');
				newEndDate = dayjs();
				break;
			case 'last30Days':
				newStartDate = dayjs().subtract(29, 'day');
				newEndDate = dayjs();
				break;
			case 'thisMonth':
				newStartDate = dayjs().startOf('month');
				newEndDate = dayjs().endOf('month');
				break;
			case 'lastMonth':
				newStartDate = dayjs().subtract(1, 'month').startOf('month');
				newEndDate = dayjs().subtract(1, 'month').endOf('month');
				break;
			default:
				return;
		}

		setTempStartDate(newStartDate);
		setTempEndDate(newEndDate);
		setActivePreset(preset);
	};

	// Apply the selected date range
	const handleApply = () => {
		setStartDate(tempStartDate);
		setEndDate(tempEndDate);

		if (onDateRangeChange) {
			onDateRangeChange({
				startDate: tempStartDate,
				endDate: tempEndDate,
				startDateFormatted: tempStartDate.format(format),
				endDateFormatted: tempEndDate.format(format),
			});
		}

		setIsOpen(false);
		setActivePreset(null);
	};

	// Cancel selection and reset to original values
	const handleCancel = () => {
		setTempStartDate(startDate);
		setTempEndDate(endDate);
		setIsOpen(false);
		setActivePreset(null);
	};

	// Handle date selection
	const handleDateClick = (date) => {
		if (singleDate) {
			setTempStartDate(date);
			setTempEndDate(date);
			if (closeOnSelect) {
				handleApply();
			}
			return;
		}

		if (!tempStartDate || (tempStartDate && tempEndDate)) {
			// Starting a new selection
			setTempStartDate(date);
			setTempEndDate(null);
		} else if (tempStartDate && !tempEndDate) {
			// Completing the selection
			if (date.isBefore(tempStartDate)) {
				setTempEndDate(tempStartDate);
				setTempStartDate(date);
			} else {
				setTempEndDate(date);
			}

			if (closeOnSelect) {
				handleApply();
			}
		}
	};

	// Handle date hover for range selection
	const handleDateHover = (date) => {
		if (tempStartDate && !tempEndDate) {
			setHoverDate(date);
		}
	};

	// Navigate to previous month
	const handlePrevMonth = () => {
		setCurrentMonth(currentMonth.subtract(1, 'month'));
	};

	// Navigate to next month
	const handleNextMonth = () => {
		setCurrentMonth(currentMonth.add(1, 'month'));
	};

	// Check if a date is in the selected range
	const isInRange = (date) => {
		if (!tempStartDate) return false;

		if (tempEndDate) {
			return date.isBetween(tempStartDate, tempEndDate, 'day', '[]');
		}

		if (hoverDate && tempStartDate) {
			const start = tempStartDate.isBefore(hoverDate)
				? tempStartDate
				: hoverDate;
			const end = tempStartDate.isBefore(hoverDate) ? hoverDate : tempStartDate;
			return date.isBetween(start, end, 'day', '[]');
		}

		return false;
	};

	// Check if a date is disabled
	const isDateDisabled = (date) => {
		if (minDate && date.isBefore(minDate, 'day')) return true;
		if (maxDate && date.isAfter(maxDate, 'day')) return true;

		return disabledDates.some((disabledDate) =>
			dayjs(disabledDate).isSame(date, 'day')
		);
	};

	// Generate calendar for a given month
	const generateCalendar = (month) => {
		const startOfMonth = month.startOf('month');
		const endOfMonth = month.endOf('month');
		const startDay = startOfMonth.day();

		const days = [];

		// Add days from previous month
		for (let i = 0; i < startDay; i++) {
			const date = startOfMonth.subtract(startDay - i, 'day');
			days.push({
				date,
				isCurrentMonth: false,
				isToday: date.isSame(dayjs(), 'day'),
				isSelected:
					date.isSame(tempStartDate, 'day') || date.isSame(tempEndDate, 'day'),
				isInRange: isInRange(date),
				isStartDate: date.isSame(tempStartDate, 'day'),
				isEndDate: date.isSame(tempEndDate, 'day'),
				isDisabled: isDateDisabled(date),
			});
		}

		// Add days of current month
		for (let i = 1; i <= endOfMonth.date(); i++) {
			const date = startOfMonth.date(i);
			days.push({
				date,
				isCurrentMonth: true,
				isToday: date.isSame(dayjs(), 'day'),
				isSelected:
					date.isSame(tempStartDate, 'day') || date.isSame(tempEndDate, 'day'),
				isInRange: isInRange(date),
				isStartDate: date.isSame(tempStartDate, 'day'),
				isEndDate: date.isSame(tempEndDate, 'day'),
				isDisabled: isDateDisabled(date),
			});
		}

		// Add days from next month to complete the grid
		const totalCells = 42; // 6 weeks
		const remainingDays = totalCells - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			const date = endOfMonth.add(i, 'day');
			days.push({
				date,
				isCurrentMonth: false,
				isToday: date.isSame(dayjs(), 'day'),
				isSelected:
					date.isSame(tempStartDate, 'day') || date.isSame(tempEndDate, 'day'),
				isInRange: isInRange(date),
				isStartDate: date.isSame(tempStartDate, 'day'),
				isEndDate: date.isSame(tempEndDate, 'day'),
				isDisabled: isDateDisabled(date),
			});
		}

		return days;
	};

	// Format display text
	const displayText = singleDate
		? tempStartDate
			? tempStartDate.format('MMM D, YYYY')
			: placeholder
		: tempStartDate && tempEndDate
			? `${tempStartDate.format('MMM D, YYYY')} ~ ${tempEndDate.format('MMM D, YYYY')}`
			: placeholder;

	const calendar1 = generateCalendar(currentMonth);
	const calendar2 = generateCalendar(currentMonth.add(1, 'month'));

	return (
		<div className={`date-range-picker ${className}`} ref={pickerRef}>
			{/* Input trigger */}
			<div className='date-picker-trigger' onClick={() => setIsOpen(!isOpen)}>
				<span className={`trigger-text ${!tempStartDate ? 'placeholder' : ''}`}>
					{displayText}
				</span>
				<svg
					className={`trigger-icon ${isOpen ? 'open' : ''}`}
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</div>

			{/* Date picker dropdown */}
			{isOpen && (
				<div className='date-picker-dropdown'>
					<div className='picker-container'>
						{/* Presets panel */}
						{(presets || showCustomRange) && (
							<div className='presets-panel'>
								<div className='presets-list'>
									{presets && (
										<>
											<button
												type='button'
												className={`preset-button ${activePreset === 'today' ? 'active' : ''}`}
												onClick={() => handlePresetSelect('today')}
											>
												{i18n.today}
											</button>
											<button
												type='button'
												className={`preset-button ${activePreset === 'yesterday' ? 'active' : ''}`}
												onClick={() => handlePresetSelect('yesterday')}
											>
												{i18n.yesterday}
											</button>
											<button
												type='button'
												className={`preset-button ${activePreset === 'last7Days' ? 'active' : ''}`}
												onClick={() => handlePresetSelect('last7Days')}
											>
												{i18n.last7Days}
											</button>
											<button
												type='button'
												className={`preset-button ${activePreset === 'last30Days' ? 'active' : ''}`}
												onClick={() => handlePresetSelect('last30Days')}
											>
												{i18n.last30Days}
											</button>
											<button
												type='button'
												className={`preset-button ${activePreset === 'thisMonth' ? 'active' : ''}`}
												onClick={() => handlePresetSelect('thisMonth')}
											>
												{i18n.thisMonth}
											</button>
											<button
												type='button'
												className={`preset-button ${activePreset === 'lastMonth' ? 'active' : ''}`}
												onClick={() => handlePresetSelect('lastMonth')}
											>
												{i18n.lastMonth}
											</button>
										</>
									)}

									{showCustomRange && (
										<div className='custom-range-section'>
											<div className='custom-range-label'>
												{i18n.customRange}
											</div>
											<div className='custom-range-display'>
												{tempStartDate && tempEndDate
													? `${tempStartDate.format('MMM D, YYYY')} - ${tempEndDate.format('MMM D, YYYY')}`
													: 'Select a date range'}
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Calendars */}
						<div className='calendars-container'>
							<div className='calendars-wrapper'>
								{/* First calendar */}
								<div className='calendar'>
									<div className='calendar-header'>
										<button
											type='button'
											className='nav-button prev'
											onClick={handlePrevMonth}
										>
											<svg
												className='nav-icon'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M15 19l-7-7 7-7'
												/>
											</svg>
										</button>
										<div className='month-year'>
											{currentMonth.format('MMM YYYY')}
										</div>
										<div className='nav-spacer'></div>
									</div>

									<div className='week-days'>
										{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
											(day) => (
												<div key={day} className='week-day'>
													{day}
												</div>
											)
										)}
									</div>

									<div className='calendar-grid'>
										{calendar1.map((day, index) => (
											<button
												key={index}
												type='button'
												disabled={day.isDisabled}
												className={`
                          calendar-day
                          ${day.isCurrentMonth ? '' : 'other-month'}
                          ${day.isToday ? 'today' : ''}
                          ${day.isSelected ? 'selected' : ''}
                          ${day.isInRange ? 'in-range' : ''}
                          ${day.isStartDate ? 'start-date' : ''}
                          ${day.isEndDate ? 'end-date' : ''}
                          ${day.isDisabled ? 'disabled' : ''}
                        `}
												onClick={() =>
													!day.isDisabled && handleDateClick(day.date)
												}
												onMouseEnter={() =>
													!day.isDisabled && handleDateHover(day.date)
												}
											>
												{day.date.date()}
											</button>
										))}
									</div>
								</div>

								{/* Second calendar */}
								<div className='calendar'>
									<div className='calendar-header'>
										<div className='nav-spacer'></div>
										<div className='month-year'>
											{currentMonth.add(1, 'month').format('MMM YYYY')}
										</div>
										<button
											type='button'
											className='nav-button next'
											onClick={handleNextMonth}
										>
											<svg
												className='nav-icon'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M9 5l7 7-7-7'
												/>
											</svg>
										</button>
									</div>

									<div className='week-days'>
										{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
											(day) => (
												<div key={day} className='week-day'>
													{day}
												</div>
											)
										)}
									</div>

									<div className='calendar-grid'>
										{calendar2.map((day, index) => (
											<button
												key={index}
												type='button'
												disabled={day.isDisabled}
												className={`
                          calendar-day
                          ${day.isCurrentMonth ? '' : 'other-month'}
                          ${day.isToday ? 'today' : ''}
                          ${day.isSelected ? 'selected' : ''}
                          ${day.isInRange ? 'in-range' : ''}
                          ${day.isStartDate ? 'start-date' : ''}
                          ${day.isEndDate ? 'end-date' : ''}
                          ${day.isDisabled ? 'disabled' : ''}
                        `}
												onClick={() =>
													!day.isDisabled && handleDateClick(day.date)
												}
												onMouseEnter={() =>
													!day.isDisabled && handleDateHover(day.date)
												}
											>
												{day.date.date()}
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Action buttons */}
							<div className='action-buttons'>
								<button
									type='button'
									className='cancel-button'
									onClick={handleCancel}
								>
									{i18n.cancel}
								</button>
								<button
									type='button'
									className='apply-button'
									onClick={handleApply}
								>
									{i18n.apply}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdvancedDateRangePicker;
