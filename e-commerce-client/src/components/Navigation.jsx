import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Form } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";

export default function Navigation() {
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearch) {
      navigate(`/?query=${debouncedSearch}`);
    }
  }, [debouncedSearch, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.PRODUCT_CATEGORIES);
        setCategories(response.data.aaData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchKeywords = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.PRODUCT_KEYWORD);
        setKeywords(response.data.aaData);
      } catch (error) {
        console.error("Error fetching keywords:", error);
      }
    };

    fetchCategories();
    fetchKeywords();
  }, []);

  useEffect(() => {
    const updateCartItemCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
      setCartItemCount(totalItems);
    };

    updateCartItemCount();
    window.addEventListener("storage", updateCartItemCount);

    return () => {
      window.removeEventListener("storage", updateCartItemCount);
    };
  }, []);

  const handleCategorySelect = (categoryId) => {
    navigate(`/?cat=${categoryId}`);
  };

  const handleKeywordSelect = (keywordId) => {
    navigate(`/?keyword=${keywordId}`);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Eduwork Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavDropdown
              title="Categories"
              id="navbarScrollingDropdown"
              aria-label="Categories"
            >
              {categories.map((category) => (
                <NavDropdown.Item
                  key={category.product_category_id}
                  onClick={() =>
                    handleCategorySelect(category.product_category_id)
                  }
                >
                  {category.product_category_name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown
              title="Keywords"
              id="navbarScrollingDropdown"
              aria-label="Keywords"
            >
              {keywords.map((keyword) => (
                <NavDropdown.Item
                  key={keyword.keyword_id}
                  onClick={() => handleKeywordSelect(keyword.keyword_id)}
                >
                  {keyword.keyword_name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Link to="/invoice" className="nav-link">
              Invoice
            </Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </Form>
          <Link to="/cart" className="position-relative">
            <FaShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {cartItemCount}
              </span>
            )}
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
