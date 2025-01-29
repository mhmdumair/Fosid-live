
// Example implementation of roomSearch function
export const roomSearch = (query: string) => {
    // Dummy data for demonstration
    const rooms = [
        { id: 1, code: 'R123', stall: 'ST133', name: 'Octave Room' },
        { id: 2, code: 'R124', stall: 'ST134', name: 'Harmonic Room' },
        // Add more room data as needed
    ];

    return rooms.filter(room => {
        const queryLower = query.toLowerCase();
        return room.code.toLowerCase().includes(queryLower) ||
               room.stall.toLowerCase().includes(queryLower) ||
               room.name.toLowerCase().includes(queryLower);
    });
};
