import QRCode from "react-qr-code";

export function TicketQR({ ticket }) {
  return (
    <div>
      <QRCode value={ticket.codigoQR} size={200} />
      <p>Ticket #{ticket._id}</p>
    </div>
  );
}
