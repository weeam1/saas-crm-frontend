// WhatsApp Message ACK states
export const MessageAck = {
	ACK_ERROR: -1, // failed to send
	ACK_PENDING: 0, // pending (one tick)
	ACK_SERVER: 1, // delivered to server
	ACK_DEVICE: 2, // delivered to recipient's device
	ACK_READ: 3, // message read (blue double ticks)
	ACK_PLAYED: 4, // media played (also blue double ticks)
};
