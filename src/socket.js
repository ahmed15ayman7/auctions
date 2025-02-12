 const connectedUsers = new Map(); // Store socket connections by userId

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle user authentication and store connection
    socket.on("authenticate", (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} authenticated with socket ${socket.id}`);
    });

    socket.on("new_bid", (bidData) => {
      io.emit("update_bids", bidData);
    });

    socket.on("auction_end", (data) => {
      io.emit("auction_ended", data);
    });

    socket.on("disconnect", () => {
      // Remove user from connected users on disconnect
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });

  // Function to send notification to specific user
  io.sendNotification = async (userId, notification) => {
    const socketId = connectedUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit("notification", notification);
    }
  };

  // Function to send notification to multiple users
  io.sendNotificationToUsers = async (userIds, notification) => {
    userIds.forEach(userId => {
      const socketId = connectedUsers.get(userId);
      if (socketId) {
        io.to(socketId).emit("notification", notification);
      }
    });
  };

  return io;
}

module.exports = setupSocket;