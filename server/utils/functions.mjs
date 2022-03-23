const getCurrentTimestamp = () => {
	const raw = new Date();

	const time = raw.toLocaleTimeString('uk');

	const [year, month, day] = [
		raw.getFullYear(),
		raw.getMonth(),
		raw.getDate(),
	];

	return `${year}-${month}-${day} ${time}`;
};

export { getCurrentTimestamp };
