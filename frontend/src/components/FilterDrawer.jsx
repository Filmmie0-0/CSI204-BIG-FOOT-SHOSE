import React, { useState, useMemo } from 'react'
import { Offcanvas, Form, Button, Row, Col } from 'react-bootstrap'
import { Footprints, Snowflake, Disc, HelpCircle } from 'lucide-react'

const FilterDrawer = ({ isOpen, onClose, filters, setFilters, products }) => {
  const [openSections, setOpenSections] = useState({
    sort: true,
    style: true,
    size: true,
    color: true,
    price: true,
    gender: true,
  })

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // คำนวณจำนวนสินค้า
  const counts = useMemo(() => {
    const styleCount = {}
    const colorCount = {}
    const genderCount = { Men: 0, Unisex: 0, Women: 0 }

    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (!p) return
        if (p.style)
          styleCount[p.style.toLowerCase()] =
            (styleCount[p.style.toLowerCase()] || 0) + 1
        if (p.color)
          colorCount[p.color.toLowerCase()] =
            (colorCount[p.color.toLowerCase()] || 0) + 1
        if (p.gender && genderCount[p.gender] !== undefined) {
          genderCount[p.gender] = (genderCount[p.gender] || 0) + 1
        }
      })
    }
    return { styleCount, colorCount, genderCount }
  }, [products])

  const stylesData = [
    { id: 'manshoe', name: 'Man’s Shoe', icon: '👞' },
    { id: 'flip-flops', name: 'Flip-Flops', icon: '🩴' },
    { id: 'running', name: 'Running Shoe™', icon: '👟' },
    { id: 'sandals', name: 'Sandals', icon: '👡' },
  ]

  const sizesData = [
    'M2',
    'M3',
    'M4',
    'M5',
    'M6',
    'M7',
    'M8',
    'M9',
    'M10',
    'M11',
    'M12',
    'M13',
    'M14',
  ]

  const colorsData = [
    { name: 'Banana Ice', hex: '#FFFACC' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Black', hex: '#000000' },
    { name: 'Blue', hex: '#1E90FF' },
    { name: 'Green', hex: '#2E8B57' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Yellow', hex: '#FFD700' },
  ]

  const pricesData = [
    'Under 1000฿',
    '1000฿ - 2000฿',
    '2000฿ - 3000฿',
    '3000฿ - 4000฿',
  ]

  const styles = {
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: '900',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    sectionBtn: {
      width: '100%',
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      color: '#000',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '1px',
      padding: '10px 0',
    },
    chevron: (isOpen) => ({
      width: '16px',
      height: '16px',
      transition: 'transform 0.2s',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    styleCard: (isActive) => ({
      width: '100%',
      border: isActive ? '1px solid #000' : '1px solid #dee2e6',
      padding: '12px',
      borderRadius: '4px',
      background: isActive ? '#f8f9fa' : '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
    }),
    sizeGroupBtn: (isActive) => ({
      padding: '6px 16px',
      fontSize: '12px',
      fontWeight: 'bold',
      borderRadius: '50px',
      border: '1px solid ' + (isActive ? '#006699' : 'transparent'),
      backgroundColor: isActive ? '#006699' : '#f1f3f5',
      color: isActive ? '#fff' : '#495057',
      marginRight: '8px',
    }),
    sizeGridBtn: (isActive) => ({
      width: '100%',
      border: '1px solid ' + (isActive ? '#000' : '#dee2e6'),
      backgroundColor: isActive ? '#000' : '#fff',
      color: isActive ? '#fff' : '#212529',
      fontWeight: 'bold',
      fontSize: '12px',
      padding: '8px 0',
      borderRadius: '4px',
    }),
    colorCard: (isActive) => ({
      width: '100%',
      border: isActive ? '1px solid #000' : '1px solid #dee2e6',
      padding: '8px',
      borderRadius: '4px',
      background: isActive ? '#f8f9fa' : '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }),
    footerBtnClear: {
      flex: 1,
      padding: '14px',
      border: '1px solid #000',
      background: '#fff',
      color: '#000',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '12px',
      letterSpacing: '1px',
    },
    footerBtnShow: {
      flex: 2,
      padding: '14px',
      border: 'none',
      background: '#000',
      color: '#fff',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '12px',
      letterSpacing: '1px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
  }

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      style={{ maxWidth: '420px', width: '100%' }}
    >
      {/* Header */}
      <Offcanvas.Header closeButton className="border-b px-4 py-3">
        <Offcanvas.Title style={styles.headerTitle}>
          Filter & Sort
        </Offcanvas.Title>
      </Offcanvas.Header>

      {/* Body */}
      <Offcanvas.Body className="d-flex flex-column justify-content-between p-0">
        <div className="flex-grow-1 overflow-auto px-4 py-3">
          {/* SORT BY */}
          <div className="border-bottom pb-4 mb-3">
            <button
              onClick={() => toggleSection('sort')}
              style={styles.sectionBtn}
              className="justify-content-between"
            >
              <span>Sort by</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                style={styles.chevron(openSections.sort)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            {openSections.sort && (
              <Form className="mt-2 pl-1">
                {[
                  { id: 'low-high', label: 'Price (low - high)' },
                  { id: 'newest', label: 'Newest' },
                  { id: 'top-sellers', label: 'Top Sellers' },
                  { id: 'high-low', label: 'Price (high - low)' },
                ].map((item) => (
                  <Form.Check
                    key={item.id}
                    type="radio"
                    id={`sort-${item.id}`}
                    label={item.label}
                    name="sortBy"
                    checked={filters.sortBy === item.id}
                    onChange={() => setFilters({ ...filters, sortBy: item.id })}
                    className="mb-2 text-secondary font-weight-medium"
                    style={{ fontSize: '14px', cursor: 'pointer' }}
                  />
                ))}
              </Form>
            )}
          </div>

          {/* สไตล์ */}
          <div className="border-bottom pb-4 mb-3">
            <button
              onClick={() => toggleSection('style')}
              style={styles.sectionBtn}
              className="justify-content-between"
            >
              <span>Style</span>
              <span style={{ fontSize: '16px' }}>
                {openSections.style ? '−' : '+'}
              </span>
            </button>
            {openSections.style && (
              <Row className="g-2 mt-2">
                {stylesData.map((style) => {
                  const isActive = filters.style === style.id
                  const count = counts.styleCount[style.id] || 0
                  return (
                    <Col xs={6} key={style.id}>
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            style: isActive ? '' : style.id,
                          })
                        }
                        style={styles.styleCard(isActive)}
                      >
                        <span style={{ fontSize: '24px', marginBottom: '4px' }}>
                          {style.icon}
                        </span>
                        <span>{style.name}</span>
                        <span
                          className="text-muted"
                          style={{ fontSize: '10px' }}
                        >
                          ({count})
                        </span>
                      </button>
                    </Col>
                  )
                })}
              </Row>
            )}
          </div>

          {/* ไซส์ */}
          <div className="border-bottom pb-4 mb-3">
            <button
              onClick={() => toggleSection('size')}
              style={styles.sectionBtn}
              className="justify-content-between"
            >
              <span>Size</span>
              <span style={{ fontSize: '16px' }}>
                {openSections.size ? '−' : '+'}
              </span>
            </button>
            {openSections.size && (
              <div className="mt-2">
                <div className="d-flex mb-3">
                  {['Men', 'Women', 'Kids'].map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() =>
                        setFilters({ ...filters, sizeGroup: group, size: '' })
                      }
                      style={styles.sizeGroupBtn(filters.sizeGroup === group)}
                    >
                      {group}
                    </button>
                  ))}
                </div>
                <Row className="g-1">
                  {sizesData.map((size) => {
                    const isActive = filters.size === size
                    return (
                      <Col xs={3} key={size} className="mb-1">
                        <button
                          type="button"
                          onClick={() =>
                            setFilters({
                              ...filters,
                              size: isActive ? '' : size,
                            })
                          }
                          style={styles.sizeGridBtn(isActive)}
                        >
                          {size}
                        </button>
                      </Col>
                    )
                  })}
                </Row>
              </div>
            )}
          </div>

          {/* สี */}
          <div className="border-bottom pb-4 mb-3">
            <button
              onClick={() => toggleSection('color')}
              style={styles.sectionBtn}
              className="justify-content-between"
            >
              <span>Color</span>
              <span style={{ fontSize: '16px' }}>
                {openSections.color ? '−' : '+'}
              </span>
            </button>
            {openSections.color && (
              <Row className="g-2 mt-2">
                {colorsData.map((color) => {
                  const isActive = filters.color === color.name
                  const count = counts.colorCount[color.name.toLowerCase()] || 0
                  return (
                    <Col xs={4} key={color.name}>
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            color: isActive ? '' : color.name,
                          })
                        }
                        style={styles.colorCard(isActive)}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: color.hex,
                            border: '1px solid #dee2e6',
                            marginBottom: '4px',
                          }}
                        />
                        <span
                          className="text-truncate w-100 text-center"
                          style={{ fontSize: '10px' }}
                        >
                          {color.name}
                        </span>
                        <span
                          className="text-muted"
                          style={{ fontSize: '9px' }}
                        >
                          ({count})
                        </span>
                      </button>
                    </Col>
                  )
                })}
              </Row>
            )}
          </div>

          {/* ราคา */}
          <div className="border-bottom pb-4 mb-3">
            <button
              onClick={() => toggleSection('price')}
              style={styles.sectionBtn}
              className="justify-content-between"
            >
              <span>Price</span>
              <span style={{ fontSize: '16px' }}>
                {openSections.price ? '−' : '+'}
              </span>
            </button>
            {openSections.price && (
              <Form className="mt-2 pl-1">
                {pricesData.map((price) => (
                  <Form.Check
                    key={price}
                    type="checkbox"
                    id={`price-${price}`}
                    label={price}
                    checked={filters.priceRange === price}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        priceRange: filters.priceRange === price ? '' : price,
                      })
                    }
                    className="mb-2 text-secondary"
                    style={{ fontSize: '14px' }}
                  />
                ))}
              </Form>
            )}
          </div>

          {/* เพศ */}
          <div className="pb-4">
            <button
              onClick={() => toggleSection('gender')}
              style={styles.sectionBtn}
              className="justify-content-between"
            >
              <span>Gender</span>
              <span style={{ fontSize: '16px' }}>
                {openSections.gender ? '−' : '+'}
              </span>
            </button>
            {openSections.gender && (
              <Form className="mt-2 pl-1">
                {['Men', 'Unisex', 'Women'].map((g) => {
                  const isChecked = filters.gender.includes(g)
                  const count = counts.genderCount[g] || 0
                  return (
                    <Form.Check
                      key={g}
                      type="checkbox"
                      id={`gender-${g}`}
                      label={`${g} (${count})`}
                      checked={isChecked}
                      onChange={() => {
                        const updatedGender = isChecked
                          ? filters.gender.filter((item) => item !== g)
                          : [...filters.gender, g]
                        setFilters({ ...filters, gender: updatedGender })
                      }}
                      className="mb-2 text-secondary"
                      style={{ fontSize: '14px' }}
                    />
                  )
                })}
              </Form>
            )}
          </div>
        </div>

        {/* ปุ่มด้านล่าง */}
        <div className="p-3 border-top bg-white d-flex gap-2">
          <button
            onClick={() =>
              setFilters({
                sortBy: 'newest',
                style: '',
                sizeGroup: 'Men',
                size: '',
                color: '',
                priceRange: '',
                gender: [],
              })
            }
            style={styles.footerBtnClear}
          >
            Clear
          </button>
          <button onClick={onClose} style={styles.footerBtnShow}>
            <span>Show items</span>
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default FilterDrawer
