// const prisma = require("../prismaClient");
// let io;

// const setIo = (socketIo) => {
//   io = socketIo;
// };

// const createNotification = async ({ userId, auctionId, type, message }) => {
//   const notification = await prisma.notification.create({
//     data: {
//       userId,
//       auctionId,
//       type,
//       message,
//     },
//     include: {
//       auction: {
//         include: {
//           land: true
//         }
//       },
//       user: true
//     }
//   });

//   // Send real-time notification through socket
//   if (io) {
//     io.sendNotification(userId, notification);
//   }

//   return notification;
// };

// const createMultipleNotifications = async ({ userIds, auctionId, type, message }) => {
//   const notifications = await Promise.all(
//     userIds.map(userId =>
//       prisma.notification.create({
//         data: {
//           userId,
//           auctionId,
//           type,
//           message,
//         },
//         include: {
//           auction: {
//             include: {
//               land: true
//             }
//           },
//           user: true
//         }
//       })
//     )
//   );

//   // Send real-time notifications through socket
//   if (io) {
//     io.sendNotificationToUsers(userIds, notifications[0]);
//   }

//   return notifications;
// };

// const getUserNotifications = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const notifications = await prisma.notification.findMany({
//       where: { userId },
//       include: {
//         auction: {
//           include: {
//             land: true
//           }
//         }
//       },
//       orderBy: { createdAt: 'desc' },
//     });
//     res.json(notifications);
//   } catch (error) {
//     next(error);
//   }
// };

// const markNotificationAsRead = async (req, res, next) => {
//   try {
//     const { notificationId } = req.params;
//     const notification = await prisma.notification.update({
//       where: { id: notificationId },
//       data: { read: true },
//     });
//     res.json(notification);
//   } catch (error) {
//     next(error);
//   }
// };

// const markAllNotificationsAsRead = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     await prisma.notification.updateMany({
//       where: { userId },
//       data: { read: true },
//     });
//     res.json({ message: "All notifications marked as read" });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   setIo,
//   createNotification,
//   createMultipleNotifications,
//   getUserNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
// };
