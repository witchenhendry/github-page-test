export const HttpUtil = {

	get(path) {
		const response = fetch(path,
			{
				method: 'GET',
			}
		).catch((error) => {
			console.log('Request failed', error);
		});
		return response;
	},

}