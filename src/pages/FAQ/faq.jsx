import React, { useState } from 'react';
import { Container, Grid, Box, Typography, styled } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Colors
const primaryColor = '#ff6b6b';
const iconBgColor = '#db89ca';
const buttonColor = '#5c4d91';
const textColor = '#2b2b2b';
const borderColor = '#e0e0e0';
const lightBg = '#f9f9f9';

// Styled components
const FAQSection = styled(Box)({
  padding: '80px 0',
  backgroundColor: '#fff',
});

const SectionSubtitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#777',
  marginBottom: '15px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const IconWrapper = styled(Box)({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: iconBgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  '& svg': {
    fontSize: '16px',
  },
});

const SectionTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 700,
  color: textColor,
  fontFamily: '"Playfair Display", serif',
  marginBottom: '20px',
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: '28px',
  },
});

const Description = styled(Typography)({
  fontSize: '16px',
  color: '#777',
  lineHeight: 1.8,
  marginBottom: '30px',
  maxWidth: '90%',
});

const StyledButton = styled('a')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: buttonColor,
  color: '#fff',
  padding: '12px 30px',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  textDecoration: 'none',
  border: `2px solid ${buttonColor}`,
  borderRadius: '40px',
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: '18px',
    color: '#fff',
    transition: 'color 0.3s ease',
  },
  '&:hover': {
    backgroundColor: iconBgColor,
    borderColor: iconBgColor,
    color: '#fff',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(219, 137, 202, 0.4)',
    '& svg': {
      color: '#fff',
    },
  },
});

const AccordionList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

const AccordionItem = styled('li')({
  marginBottom: '15px',
  border: `1px solid ${borderColor}`,
  borderRadius: '20px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: primaryColor,
    boxShadow: '0 5px 20px rgba(255,107,107,0.1)',
  },
});

const AccordionButton = styled('div')({
  padding: '20px 25px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  fontSize: '16px',
  fontWeight: 600,
  color: textColor,
  transition: 'all 0.3s ease',
  position: 'relative',
  '& span': {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: iconBgColor,
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30px',
  },
  '& .arrow': {
    position: 'absolute',
    right: '25px',
    fontSize: '14px',
    color: '#999',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: lightBg,
  },
});

// Updated AccordionContent with buttonColor background
const AccordionContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen'
})(({ isOpen }) => ({
  maxHeight: isOpen ? '200px' : '0',
  opacity: isOpen ? 1 : 0,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  backgroundColor: buttonColor,  // Changed to #5c4d91
  borderTop: isOpen ? `1px solid ${borderColor}` : 'none',
}));

// Updated ContentInner with white text
const ContentInner = styled(Box)({
  padding: '20px 25px',
  '& p': {
    fontSize: '15px',
    color: '#fff',  // Changed to white for contrast
    lineHeight: 1.8,
    margin: 0,
  },
});

const faqData = [
  {
    id: 1,
    question: 'What types of business entities are there?',
    answer: 'Lorem ipsum quisque sodales miss in the varius vestibulum drana tonton turpis porttiton tellus in the fermen.',
  },
  {
    id: 2,
    question: 'Do I need legal advice just to form my business?',
    answer: 'Lorem ipsum quisque sodales miss in the varius vestibulum drana tonton turpis porttiton tellus in the fermen.',
  },
  {
    id: 3,
    question: 'What should my attorney expect from me?',
    answer: 'Lorem ipsum quisque sodales miss in the varius vestibulum drana tonton turpis porttiton tellus in the fermen.',
  },
  {
    id: 4,
    question: 'What is the role of witness in court?',
    answer: 'Lorem ipsum quisque sodales miss in the varius vestibulum drana tonton turpis porttiton tellus in the fermen.',
  },
];

const FAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <FAQSection>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionSubtitle>
              <IconWrapper>
                <PetsIcon />
              </IconWrapper>
              General & Popular
            </SectionSubtitle>
            <SectionTitle>Frequently asked questions</SectionTitle>
            <Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit lobortis sapien.
            </Description>
            <StyledButton href="#">
              <PetsIcon />
              Other FAQs
            </StyledButton>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 7, offset: 1 }}>
            <AccordionList>
              {faqData.map((faq) => (
                <AccordionItem key={faq.id}>
                  <AccordionButton onClick={() => toggleAccordion(faq.id)}>
                    <span>{faq.id.toString().padStart(2, '0')}</span>
                    {faq.question}
                    <ArrowForwardIosIcon className="arrow" sx={{
                      fontSize: 14,
                      transform: openId === faq.id ? 'rotate(90deg)' : 'none'
                    }} />
                  </AccordionButton>
                  <AccordionContent isOpen={openId === faq.id}>
                    <ContentInner>
                      <p>{faq.answer}</p>
                    </ContentInner>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </AccordionList>
          </Grid>
        </Grid>
      </Container>
    </FAQSection>
  );
};

export default FAQ;