async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json(); // Parse JSON from the response and return
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null;
    }
}
