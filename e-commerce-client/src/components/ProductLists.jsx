import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { API_ENDPOINTS } from "../config/apiConfig";
import axios from "axios";
import ProductDetail from "./ProductDetail";
import { useLocation } from "react-router-dom";

const ProductLists = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("cat");
    const keywordId = parseInt(params.get("keyword"), 10);
    const query = params.get("query");

    const fetchProducts = async () => {
      try {
        let url = `${API_ENDPOINTS.PRODUCTS}`;

        if (categoryId) {
          url += `?cat=${categoryId}`;
        }

        const response = await axios.get(url);
        let filteredProducts = response.data.aaData;

        if (keywordId) {
          filteredProducts = filteredProducts.filter((product) =>
            product.keywords.some((keyword) => keyword.id === keywordId)
          );
        }

        if (query) {
          filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );
        }

        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching product data", err);
      }
    };

    fetchProducts();
  }, [location]);

  return (
    <Container className="my-4">
      <Row>
        {products.map((product) => (
          <Col key={product.id} sm={12} md={4} lg={3} className="mb-4">
            <ProductDetail product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductLists;
