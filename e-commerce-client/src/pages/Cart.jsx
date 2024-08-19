import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Produk berhasil ditambahkan ke keranjang");
    setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const handleQtyChange = (index, delta) => {
    const updatedItems = [...cartItems];
    if (updatedItems[index].qty + delta > 0) {
      updatedItems[index].qty += delta;
      updateCart(updatedItems);
    } else {
      handleRemoveItem(index);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    updateCart(updatedItems);
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (total, { price, qty }) => total + parseFloat(price) * qty,
      0
    );

  const handleCheckOut = () => {
    navigate("/Address");
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <Row
              key={`${item.product_id}-${item.variant_id}-${index}`}
              className="mb-3"
            >
              <Col xs={3}>
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col xs={5}>
                <h5>{item.product_name}</h5>
                <p>Variant: {item.variant_name}</p>
                <p>Price: Rp {parseFloat(item.price).toLocaleString()}</p>
              </Col>
              <Col xs={4} className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQtyChange(index, -1)}
                >
                  -
                </Button>
                <Form.Control
                  type="text"
                  value={item.qty}
                  readOnly
                  className="text-center mx-2"
                  style={{ width: "50px" }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQtyChange(index, 1)}
                >
                  +
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveItem(index)}
                  className="ms-3"
                >
                  Remove
                </Button>
              </Col>
            </Row>
          ))}

          <Row>
            <Col>
              <h4>Total: Rp {calculateTotal().toLocaleString()}</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="success" onClick={handleCheckOut}>
                Checkout
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
