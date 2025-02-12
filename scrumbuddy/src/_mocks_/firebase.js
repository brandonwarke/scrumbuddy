export const db = {
    collection: vi.fn(() => ({
      where: vi.fn().mockReturnThis(),
      onSnapshot: vi.fn(callback => {
        callback({
          docs: [{ id: "1", data: () => ({ taskName: "Test Task", status: "pending" }) }]
        });
      })
    }))
  };  