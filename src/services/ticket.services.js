import { ticketModel } from "../dao/models/ticket.model.js";

class TicketService {
    async createTicket(data) {
        if (
            !data.purchase_datetime ||
            !data.amount ||
            !data.purchaser
        ) {
            throw new Error("Datos incompletos para crear el ticket.");
        }
        const ticket = new ticketModel(data);
        await ticket.save();
        console.log("Ticket creado:", ticket);
        return ticket;
    }
}

export default TicketService;
