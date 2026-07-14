import React from 'react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  Button,
} from 'react-bootstrap'

const Navbar = () => {
  const { userInfo, logout } = useAuthStore()
  const cart = useCartStore((state) => state.cart)
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0)

  const styles = {
    navContainer: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f3f4f6',
      paddingTop: '8px',
      paddingBottom: '8px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    },
    brandLogo: {
      fontSize: '1.5rem',
      fontWeight: '900',
      letterSpacing: '-1px',
      color: '#000000',
      textTransform: 'uppercase',
      textDecoration: 'none',
    },
    menuLink: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      textDecoration: 'none',
      transition: 'color 0.2s',
      padding: '8px 4px',
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      padding: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#111827',
      position: 'relative',
      cursor: 'pointer',
    },
    badge: {
      position: 'absolute',
      top: '-2px',
      right: '-2px',
      backgroundColor: '#000000',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: 'bold',
      borderRadius: '50%',
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }

  return (
    <BootstrapNavbar style={styles.navContainer} expand="md">
      <Container
        style={{ maxWidth: '1240px' }}
        className="d-flex justify-content-between align-items-center"
      >
        {/* โลโก้ */}
        <div className="flex-shrink-0">
          <Link to="/" style={styles.brandLogo}>
            Big Foot Shoes
          </Link>
        </div>

        {/* เมนูลิงก์หลัก */}
        <BootstrapNavbar.Collapse
          id="navbar-nav"
          className="justify-content-center"
        >
          <Nav className="gap-4">
            <Link
              to="/"
              style={styles.menuLink}
              className="hover:text-gray-500"
            >
              New Arrivals
            </Link>
            <Link
              to="/men"
              style={styles.menuLink}
              className="hover:text-gray-500"
            >
              Men
            </Link>
            <Link
              to="/women"
              style={styles.menuLink}
              className="hover:text-gray-500"
            >
              Women
            </Link>
          </Nav>
        </BootstrapNavbar.Collapse>

        {/* กลุ่มไอคอน ค้นหา/โปรไฟล์/ตะกร้า */}
        <div className="d-flex align-items-center gap-3">
          {/* ค้นหา */}
          <button style={styles.iconBtn} aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              style={{ width: '22px', height: '22px' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z"
              />
            </svg>
          </button>

          {/* โปรไฟล์ */}
          <Link to="/profile" style={styles.iconBtn} aria-label="Profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              style={{ width: '22px', height: '22px' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>

          {/* ตะกร้า พร้อมนับจำนวนสินค้า */}
          <Link to="/cart" style={styles.iconBtn} aria-label="Cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              style={{ width: '22px', height: '22px' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span style={styles.badge}>{cartItemCount}</span>
            )}
          </Link>
        </div>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar 
