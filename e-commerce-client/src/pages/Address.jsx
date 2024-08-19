import { useState, useEffect } from "react";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Address() {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [costs, setCosts] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [weight, setWeight] = useState(1000);
  const [courier, setCourier] = useState("jne");
  const [selectedService, setSelectedService] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    addressDetail: "",
  });
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCartItems);
  }, []);

  useEffect(() => {
    axios
      .get("/api/provinces")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      axios
        .get(`/api/cities/${selectedProvinceId}`)
        .then((response) => setCities(response.data.rajaongkir.results))
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedCityId && courier) {
      axios
        .post("/api/cost", { destination: selectedCityId, weight, courier })
        .then((response) => {
          const costsArray = response.data.rajaongkir.results[0]?.costs || [];
          setCosts(costsArray);
        })
        .catch((error) => console.error("Error fetching costs:", error));
    }
  }, [selectedCityId, weight, courier]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    const selectedCost = costs.find((cost) => cost.service === selectedService);
    if (selectedCost) {
      setDeliveryFee(selectedCost.cost[0].value);
    }
  }, [selectedService, costs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));

    if (name === "province") {
      const selectedProvince = provinces.find(
        (province) => province.province_id === value
      );
      setSelectedProvinceId(value);
      setAddress((prevAddress) => ({
        ...prevAddress,
        province: selectedProvince.province,
        city: "",
      }));
      setCities([]);
    }

    if (name === "city") {
      const selectedCity = cities.find((city) => city.city_id === value);
      setSelectedCityId(value);
      setAddress((prevAddress) => ({
        ...prevAddress,
        city: selectedCity.city_name,
      }));
    }
  };

  const handleCheckout = () => {
    const orderJson = cartItems.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      product_price: item.price,
      product_qty: item.qty,
      product_weight: weight,
    }));
    setLoading(true);
    axios
      .post("https://demo.sistemtoko.com/public/demo/web_order", { address })
      .then((response) => {
        const invoiceData = {
          address,
          orderJson,
          totalPrice,
          deliveryFee,
        };
        localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
        localStorage.removeItem("cart");
        navigate("/invoice");
      })
      .catch((error) => console.error("Error during checkout:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (!storedCart || storedCart.length === 0) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <Container>
      <h2>Shipping Cost</h2>
      <Form>
        <Row>
          <Col md="6">
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={address.name}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group>
              <Form.Label>Phone Number:</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={address.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md="12">
            <Form.Group>
              <Form.Label>Address Detail:</Form.Label>
              <Form.Control
                as="textarea"
                name="addressDetail"
                value={address.addressDetail}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group>
              <Form.Label>Province:</Form.Label>
              <Form.Control
                as="select"
                name="province"
                value={selectedProvinceId}
                onChange={handleInputChange}
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option
                    key={province.province_id}
                    value={province.province_id}
                  >
                    {province.province}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group>
              <Form.Label>City:</Form.Label>
              <Form.Control
                as="select"
                name="city"
                value={selectedCityId}
                onChange={handleInputChange}
                disabled={!selectedProvinceId}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group>
              <Form.Label>Weight (grams):</Form.Label>
              <Form.Control
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group>
              <Form.Label>Courier:</Form.Label>
              <Form.Control
                as="select"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                disabled={!selectedCityId}
              >
                <option value="jne">JNE</option>
                <option value="pos">POS</option>
                <option value="tiki">TIKI</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group>
          <Form.Label>Service:</Form.Label>
          <Form.Control
            as="select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            disabled={!courier || costs.length === 0}
          >
            <option value="">Select Service</option>
            {costs.map((cost) => (
              <option key={cost.service} value={cost.service}>
                {`${cost.service} - ${cost.cost[0].etd} days - Rp. ${cost.cost[0].value}`}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <div>
          <h4>Product Price: Rp. {totalPrice}</h4>
          <h4>Delivery Fee: Rp. {deliveryFee}</h4>
          <h4>Total Price: Rp. {totalPrice + deliveryFee}</h4>
        </div>
        <Button
          variant="primary"
          onClick={handleCheckout}
          disabled={loading || !selectedService}
        >
          {loading ? "Processing..." : "Checkout"}
        </Button>
      </Form>
    </Container>
  );
}
