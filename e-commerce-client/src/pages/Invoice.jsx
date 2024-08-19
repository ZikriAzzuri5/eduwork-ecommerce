import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";

export default function Invoice() {
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const storedInvoiceData = JSON.parse(localStorage.getItem("invoiceData"));
    setInvoiceData(storedInvoiceData);
  }, []);

  if (!invoiceData) {
    return <p>loading invoice...</p>;
  }

  const { address, totalPrice, deliveryFee } = invoiceData;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <Container className="my-4">
      <h2 className="mb-4">Invoice</h2>
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          Shipping Address
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Name:</strong> {address.name}
          </p>
          <p>
            <strong>Phone:</strong> {address.phone}
          </p>
          <p>
            <strong>Address:</strong> {address.addressDetail}
          </p>
          <p>
            <strong>City:</strong> {address.city}
          </p>
          <p>
            <strong>Province:</strong> {address.province}
          </p>
          <p>
            <strong>Payment to:</strong> Zikri Azzuri BCA xxx-xxx-223
          </p>
        </Card.Body>
      </Card>

      <h3 className="mt-4">Order Details</h3>
      <Card className="mt-4">
        <Card.Body>
          <h4>Total Price: {totalPrice.toLocaleString()} IDR</h4>
          <h4>Delivery Fee: {deliveryFee.toLocaleString()} IDR</h4>
          <h4>Grand Total: {grandTotal.toLocaleString()} IDR</h4>
        </Card.Body>
      </Card>
    </Container>
  );
}
