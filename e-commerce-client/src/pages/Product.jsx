import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";
import { Container, Card, Button, Row, Col, Image } from "react-bootstrap";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productResponse, variantsResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.PRODUCT_DETAIL(id)),
          axios.get(API_ENDPOINTS.PRODUCT_VARIANT(id)),
        ]);

        setProduct(productResponse.data);
        setVariants(variantsResponse.data);
        setSelectedVariant(variantsResponse.data[0] || null);
      } catch (err) {
        console.error("Error fetching product data", err);
      }
    };

    fetchProductData();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const imageUrl = selectedVariant
    ? `${API_ENDPOINTS.PRODUCT_IMAGE_BASE_URL}/${selectedVariant.product_img}`
    : `${API_ENDPOINTS.PRODUCT_IMAGE_BASE_URL}${product.photo}`;

  const addToCart = () => {
    const cartItem = {
      product_id: product.product_id,
      product_name: product.product_name,
      product_image: imageUrl,
      variant_id: selectedVariant?.product_id,
      variant_name: selectedVariant?.varian_keyword_value,
      price: selectedVariant
        ? selectedVariant.product_price
        : product.product_price,
      qty: 1,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    navigate("/Cart");
  };
  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <Image src={imageUrl} rounded fluid />
        </Col>
        <Col md={6}>
          <Card className="border-0">
            <Card.Body>
              <Card.Title>{product.product_name}</Card.Title>
              <Card.Text>{product.product_description}</Card.Text>
              <Card.Text>
                <strong>
                  Rp.{" "}
                  {selectedVariant
                    ? selectedVariant.product_price
                    : product.product_price}
                </strong>
              </Card.Text>
              <Card.Text>
                Stock:{" "}
                {selectedVariant
                  ? selectedVariant.product_qty_stock
                  : product.product_qty_stock}
              </Card.Text>
            </Card.Body>
          </Card>
          {variants.length > 0 && (
            <Card className="mt-3 border-0">
              <Card.Body>
                <Card.Title>Variant Options</Card.Title>
                {variants.map((variant) => (
                  <Button
                    key={variant.product_id}
                    onClick={() => setSelectedVariant(variant)}
                    variant={
                      selectedVariant?.product_id === variant.product_id
                        ? "dark"
                        : "light"
                    }
                    className="m-1"
                  >
                    {variant.varian_keyword_value}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          )}

          <Button variant="dark" className="mt-3" onClick={addToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Product;
