class DataFetcher {
  async getData(url: string) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export { DataFetcher };
