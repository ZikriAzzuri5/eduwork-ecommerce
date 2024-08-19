import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProductDetail = ({ product }) => {
  const { id, photo, name, description, price } = product;

  return (
    <Card className="d-flex align-items-center justify-content-center text-center">
      <Link to={`/product/${id}`}>
        <Card.Img variant="top" src={photo} />
      </Link>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text>
          <strong>Rp.{price}</strong>
        </Card.Text>
        <Link to={`/product/${id}`}>
          <Button variant="dark">Detail</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ProductDetail;
