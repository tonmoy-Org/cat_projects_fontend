import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  styled,
  Button,
  TextField,
  Rating,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Pets as PetsIcon,
  Recycling as RecyclingIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

// Theme colors
const primaryColor = '#db89ca';
const iconColor = '#db89ca';
const textColor = '#1a1a1a';
const lightGray = '#f5f5f5';
const mediumGray = '#e0e0e0';
const darkGray = '#666666';

// Styled components
const ProductDetailSection = styled(Box)({
  backgroundColor: '#ffffff',
  padding: '80px 0',
  width: '100%',
  '@media (max-width: 900px)': {
    padding: '60px 0',
  },
  '@media (max-width: 600px)': {
    padding: '40px 0',
  },
});

// Image Gallery Styles
const ImageGalleryWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '450px', // Limit the width of the image gallery
  margin: '0 auto', // Center it
  '@media (max-width: 900px)': {
    maxWidth: '400px',
  },
  '@media (max-width: 600px)': {
    maxWidth: '100%',
  },
});

const MainImageWrapper = styled(Box)({
  width: '100%',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  backgroundColor: '#fff',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
});

const MainImage = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
});

const ThumbnailWrapper = styled(Box)({
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  '@media (max-width: 600px)': {
    justifyContent: 'center',
  },
});

const Thumbnail = styled('img')(({ active }) => ({
  width: '70px',
  height: '70px',
  objectFit: 'cover',
  borderRadius: '8px',
  cursor: 'pointer',
  border: active ? `3px solid ${primaryColor}` : '3px solid transparent',
  opacity: active ? 1 : 0.7,
  transition: 'all 0.2s ease',
  '&:hover': {
    opacity: 1,
    borderColor: primaryColor,
  },
  '@media (max-width: 600px)': {
    width: '60px',
    height: '60px',
  },
}));

// Product Info Styles
const ProductInfoWrapper = styled(Box)({
  padding: '20px',
  '@media (max-width: 900px)': {
    padding: '20px 0',
  },
});

const ProductTitle = styled(Typography)({
  fontSize: '32px',
  fontWeight: 700,
  color: textColor,
  marginBottom: '20px',
  '@media (max-width: 600px)': {
    fontSize: '28px',
  },
});

const ProductDescription = styled(Typography)({
  fontSize: '16px',
  color: darkGray,
  lineHeight: 1.6,
  marginBottom: '30px',
});

const ProductPrice = styled(Typography)({
  fontSize: '36px',
  fontWeight: 700,
  color: primaryColor,
  marginBottom: '15px',
  '@media (max-width: 600px)': {
    fontSize: '32px',
  },
});

const RatingWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '30px',
});

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ffb400',
  },
  '& .MuiRating-iconHover': {
    color: '#ffb400',
  },
});

const ReviewCount = styled(Typography)({
  fontSize: '14px',
  color: darkGray,
});

// Add to Cart Section
const AddToCartWrapper = styled(Box)({
  display: 'flex',
  gap: '15px',
  marginBottom: '30px',
  flexWrap: 'wrap',
  '@media (max-width: 600px)': {
    flexDirection: 'column',
  },
});

const QuantityInput = styled(TextField)({
  width: '80px', // Made smaller
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: mediumGray,
    },
    '&:hover fieldset': {
      borderColor: primaryColor,
    },
  },
  '& input': {
    textAlign: 'center',
    padding: '8px 0', // Reduced padding
    fontSize: '14px', // Smaller font
  },
  '@media (max-width: 600px)': {
    width: '100%',
  },
});

const AddToCartButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  fontSize: '14px', // Smaller font
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '6px 16px', // Reduced padding (was 12px 30px)
  minWidth: '120px', // Fixed minimum width
  width: 'auto', // Auto width
  flex: '0 1 auto', // Don't grow, allow shrink
  '&:hover': {
    backgroundColor: '#e05a5a',
  },
  '@media (max-width: 600px)': {
    width: '100%',
    padding: '8px 16px',
  },
});

// Feature List Styles
const FeatureList = styled(Box)({
  marginBottom: '30px',
});

const FeatureItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '15px',
  '& svg': {
    fontSize: '24px',
    color: iconColor,
  },
  '& p': {
    fontSize: '16px',
    color: textColor,
    margin: 0,
    fontWeight: 500,
  },
});

// Tabs Styles
const TabsWrapper = styled(Box)({
  marginTop: '50px',
});

const TabHeaders = styled(Box)({
  display: 'flex',
  gap: '30px',
  borderBottom: `2px solid ${mediumGray}`,
  marginBottom: '30px',
});

const TabHeader = styled(Typography)(({ active }) => ({
  fontSize: '18px',
  fontWeight: 600,
  color: active ? primaryColor : darkGray,
  cursor: 'pointer',
  paddingBottom: '10px',
  borderBottom: active ? `3px solid ${primaryColor}` : '3px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: primaryColor,
  },
}));

const TabContent = styled(Box)({
  padding: '20px 0',
});

const FeaturesList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  '& li': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
    fontSize: '16px',
    color: darkGray,
    '& svg': {
      color: iconColor,
      fontSize: '20px',
    },
  },
});

// Reviews Section Styles
const ReviewsWrapper = styled(Box)({
  marginTop: '30px',
});

const ReviewItem = styled(Box)({
  display: 'flex',
  gap: '20px',
  padding: '20px 0',
  borderBottom: `1px solid ${mediumGray}`,
  '@media (max-width: 600px)': {
    flexDirection: 'column',
    gap: '10px',
  },
});

const ReviewAvatar = styled(Avatar)({
  width: '60px',
  height: '60px',
  backgroundColor: iconColor,
});

const ReviewContent = styled(Box)({
  flex: 1,
});

const ReviewHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
  flexWrap: 'wrap',
  gap: '10px',
});

const ReviewAuthor = styled(Typography)({
  fontSize: '16px',
  fontWeight: 600,
  color: textColor,
});

const ReviewDate = styled(Typography)({
  fontSize: '14px',
  color: darkGray,
});

const ReviewText = styled(Typography)({
  fontSize: '15px',
  color: darkGray,
  lineHeight: 1.6,
  marginTop: '10px',
});

// Review Form Styles
const ReviewFormWrapper = styled(Box)({
  marginTop: '30px',
  padding: '30px',
  backgroundColor: lightGray,
  borderRadius: '10px',
});

const FormTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: 600,
  color: textColor,
  marginBottom: '20px',
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: mediumGray,
    },
    '&:hover fieldset': {
      borderColor: primaryColor,
    },
    '&.Mui-focused fieldset': {
      borderColor: primaryColor,
    },
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '12px 30px',
  '&:hover': {
    backgroundColor: '#e05a5a',
  },
});

// Related Products Styles
const RelatedProductsWrapper = styled(Box)({
  marginTop: '60px',
});

const RelatedTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 700,
  color: textColor,
  marginBottom: '30px',
  textAlign: 'center',
});

const RelatedProductCard = styled(Box)({
  marginBottom: '30px',
  cursor: 'pointer',
});

const RelatedProductItem = styled(Box)({
  textAlign: 'center',
  position: 'relative',
});

const RelatedImageWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  '&:hover': {
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
});

const RelatedPriceOverlay = styled(Box)({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '6px 16px',
  borderRadius: '25px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  zIndex: 2,
  '& h4': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: textColor,
    margin: 0,
  },
  '& .hot': {
    color: primaryColor,
    fontWeight: 600,
    fontSize: '13px',
  },
  '& .price': {
    color: '#555',
    fontWeight: 600,
    fontSize: '14px',
  },
});

const RelatedProductTitle = styled(Box)({
  marginTop: '15px',
  '& h5': {
    fontSize: '16px',
    fontWeight: 600,
    color: textColor,
    margin: 0,
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      '&:hover': {
        color: primaryColor,
      },
    },
  },
});

// Sample product data
const productData = {
  id: 1,
  title: 'Small dog dish',
  price: '25.00',
  description: 'Lorem ipsum dolor sit amet consectetu in adsiscin miss rhoncus sapien suscipit fermentum mana elementum auris alisuet molestie in the miss fermen.',
  rating: 5,
  reviewCount: 1,
  mainImage: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-1.png',
  thumbnails: [
    'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/01-1.png',
    'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/05-1.png',
    'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/06-1.png',
  ],
  features: [
    'Give the fun to your best friend!',
    '100% recycled plastic',
  ],
  longDescription: 'Lorem ipsum dolor sit amet consectetu in adsiscin miss rhoncus sapien suscipit fermentum mana elementum auris alisuet molestie in the miss fermen. Lorem ipsum dolor sit amet sapien lorem fermen.',
  featurePoints: [
    'Lorem ipsum dolor sit the fermen.',
    'Fermen ipsum dolor sit amet consen.',
  ],
  reviews: [
    {
      id: 1,
      author: 'Emma Emily',
      date: 'March 25, 2025',
      rating: 5,
      text: 'There are many variations of passages of Lorem Ipsum available, but the majority have. There are many variations of passages of Lorem Ipsum available.',
      avatar: '',
    },
  ],
};

// Related products data
const relatedProducts = [
  {
    id: 4,
    title: '3 toy dog bones',
    price: '45.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/06-1.png',
    alt: '3 toy dog bones',
  },
  {
    id: 5,
    title: 'Dog ball',
    price: '35.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/02-1.png',
    alt: 'Dog ball',
  },
  {
    id: 3,
    title: 'Sand shovel',
    price: '40.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/03-1.png',
    alt: 'Sand shovel',
  },
  {
    id: 2,
    title: 'Cat ball',
    price: '35.00',
    image: 'https://shthemes.net/demosd/pepito/wp-content/uploads/2025/03/1-1.jpg',
    alt: 'Cat ball',
  },
];

const ProductDetail = () => {
  const [mainImage, setMainImage] = useState(productData.mainImage);
  const [activeTab, setActiveTab] = useState('features');
  const [quantity, setQuantity] = useState(1);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <ProductDetailSection>
      <Container maxWidth="lg">
        {/* Product Main Section */}
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <ImageGalleryWrapper>
              <MainImageWrapper>
                <MainImage src={mainImage} alt={productData.title} id="main_product_image" />
              </MainImageWrapper>
              <ThumbnailWrapper>
                {productData.thumbnails.map((thumb, index) => (
                  <Thumbnail
                    key={index}
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    active={mainImage === thumb}
                    onClick={() => handleThumbnailClick(thumb)}
                  />
                ))}
              </ThumbnailWrapper>
            </ImageGalleryWrapper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ProductInfoWrapper>
              <ProductTitle variant="h3">{productData.title}</ProductTitle>

              <ProductDescription>
                {productData.description}
              </ProductDescription>

              <ProductPrice>
                ${productData.price}
              </ProductPrice>

              <RatingWrapper>
                <StyledRating
                  value={productData.rating}
                  readOnly
                  precision={0.5}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
                <ReviewCount>{productData.reviewCount} review</ReviewCount>
              </RatingWrapper>

              <AddToCartWrapper>
                <QuantityInput
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1 }}
                  size="small"
                />
                <AddToCartButton variant="contained">
                  Add to cart
                </AddToCartButton>
              </AddToCartWrapper>

              <FeatureList>
                {productData.features.map((feature, index) => (
                  <FeatureItem key={index}>
                    {index === 0 ? <PetsIcon /> : <RecyclingIcon />}
                    <p>{feature}</p>
                  </FeatureItem>
                ))}
              </FeatureList>
            </ProductInfoWrapper>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <TabsWrapper>
          <TabHeaders>
            <TabHeader
              active={activeTab === 'features'}
              onClick={() => setActiveTab('features')}
            >
              Features
            </TabHeader>
            <TabHeader
              active={activeTab === 'reviews'}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({productData.reviewCount})
            </TabHeader>
          </TabHeaders>

          <TabContent>
            {activeTab === 'features' && (
              <Box>
                <Typography sx={{ mb: 3, color: darkGray }}>
                  {productData.longDescription}
                </Typography>
                <FeaturesList>
                  {productData.featurePoints.map((point, index) => (
                    <li key={index}>
                      <FavoriteIcon sx={{ color: iconColor, fontSize: 20 }} />
                      {point}
                    </li>
                  ))}
                </FeaturesList>
              </Box>
            )}

            {activeTab === 'reviews' && (
              <ReviewsWrapper>
                {productData.reviews.map((review) => (
                  <ReviewItem key={review.id}>
                    <ReviewAvatar>
                      {review.author.charAt(0)}
                    </ReviewAvatar>
                    <ReviewContent>
                      <ReviewHeader>
                        <ReviewAuthor>{review.author}</ReviewAuthor>
                        <ReviewDate>{review.date}</ReviewDate>
                      </ReviewHeader>
                      <StyledRating value={review.rating} readOnly size="small" />
                      <ReviewText>{review.text}</ReviewText>
                    </ReviewContent>
                  </ReviewItem>
                ))}

                {/* Review Form */}
                <ReviewFormWrapper>
                  <FormTitle>Add a review</FormTitle>
                  <form>
                    <StyledRating
                      sx={{ mb: 2 }}
                      name="rating"
                      defaultValue={0}
                      size="large"
                    />

                    <StyledTextField
                      fullWidth
                      placeholder="Name*"
                      required
                      size="small"
                    />

                    <StyledTextField
                      fullWidth
                      placeholder="Email*"
                      type="email"
                      required
                      size="small"
                    />

                    <StyledTextField
                      fullWidth
                      placeholder="Your Review *"
                      multiline
                      rows={4}
                      required
                    />

                    <SubmitButton type="submit" variant="contained">
                      Submit
                    </SubmitButton>
                  </form>
                </ReviewFormWrapper>
              </ReviewsWrapper>
            )}
          </TabContent>
        </TabsWrapper>

        {/* Related Products */}
        <RelatedProductsWrapper>
          <RelatedTitle variant="h4">Related products</RelatedTitle>
          <Grid container spacing={3}>
            {relatedProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <RelatedProductCard>
                  <RelatedProductItem>
                    <RelatedImageWrapper>
                      <a href={`#product-${product.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                        <img src={product.image} alt={product.alt} />
                      </a>
                      <RelatedPriceOverlay>
                        <a href={`#product-${product.id}`} style={{ textDecoration: 'none' }}>
                          <h4>
                            <span className="hot">Hot</span>
                            <span className="price">${product.price}</span>
                          </h4>
                        </a>
                      </RelatedPriceOverlay>
                    </RelatedImageWrapper>
                    <RelatedProductTitle>
                      <h5>
                        <a href={`#product-${product.id}`}>
                          {product.title}
                        </a>
                      </h5>
                    </RelatedProductTitle>
                  </RelatedProductItem>
                </RelatedProductCard>
              </Grid>
            ))}
          </Grid>
        </RelatedProductsWrapper>
      </Container>
    </ProductDetailSection>
  );
};

export default ProductDetail;