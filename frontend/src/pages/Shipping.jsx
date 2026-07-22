import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress } = useCartStore();
  const navigate = useNavigate();

  // ดึงข้อมูลเก่ามาแสดง (ถ้าเคยกรอกไว้แล้ว)
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'Thailand');
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber || '');

  const submitHandler = (e) => {
    e.preventDefault();
    // บันทึกข้อมูลลง Zustand
    saveShippingAddress({ address, city, postalCode, country, phoneNumber });
    
    // บันทึกเสร็จแล้วพาไปหน้าสรุปคำสั่งซื้อ (Place Order)
    navigate('/placeorder');
  };

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: '700px' }}>
      <h1 className="display-5 fw-black text-dark text-uppercase text-center mb-5" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
        Shipping Address
      </h1>

      <Card className="border-0 shadow-sm rounded-4 bg-light">
        <Card.Body className="p-4 p-md-5">
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-dark text-uppercase small" style={{ letterSpacing: '1px' }}>Address</Form.Label>
              <Form.Control
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Apartment 4B"
                className="py-3 px-4 shadow-none focus-ring border-0"
                style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-dark text-uppercase small" style={{ letterSpacing: '1px' }}>City</Form.Label>
              <Form.Control
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bangkok"
                className="py-3 px-4 shadow-none focus-ring border-0"
                style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-dark text-uppercase small" style={{ letterSpacing: '1px' }}>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08X-XXX-XXXX"
                className="py-3 px-4 shadow-none focus-ring border-0"
                style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
              />
            </Form.Group>

            <Row className="mb-4 gx-4">
              <Col sm={6} className="mb-4 mb-sm-0">
                <Form.Group>
                  <Form.Label className="fw-bold text-dark text-uppercase small" style={{ letterSpacing: '1px' }}>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10110"
                    className="py-3 px-4 shadow-none focus-ring border-0"
                    style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="fw-bold text-dark text-uppercase small" style={{ letterSpacing: '1px' }}>Country</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="py-3 px-4 shadow-none focus-ring border-0 bg-white"
                    style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="pt-4 mt-2 border-top">
              <Button
                type="submit"
                variant="dark"
                size="lg"
                className="w-100 py-3 rounded-pill fw-bold text-uppercase shadow-sm hover-translate-y transition-all"
                style={{ letterSpacing: '1.5px' }}
              >
                Continue to Order Summary
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Shipping;