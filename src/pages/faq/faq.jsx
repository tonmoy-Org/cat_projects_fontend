import React, { useState } from 'react';
import { Container, Grid, Box, Typography, styled } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Colors
const primaryColor = '#ff6b6b';
const iconColor = '#db89ca';
const buttonColor = '#5c4d91';
const textColor = '#1a1a1a';
const borderColor = '#e0e0e0';
const lightBg = '#f9f9f9';

// Styled components
const FAQSection = styled(Box)({
  paddingBottom: '80px 0',
  backgroundColor: '#fff',
});

const SectionHeaderWrapper = styled(Box)({
  marginBottom: '30px',
});

const HeaderTopRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
  flexWrap: 'wrap',
});

const SectionIconWrapper = styled(Box)({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: iconColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SectionSubtitle = styled(Typography)({
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#666',
  textTransform: 'uppercase',
});

const SectionTitle = styled(Typography)({
  fontSize: '38px',
  fontWeight: 700,
  color: textColor,
  lineHeight: 1.2,
  marginBottom: '20px',
  '@media (max-width: 900px)': {
    fontSize: '32px',
  },
  '@media (max-width: 600px)': {
    fontSize: '28px',
  },
});

const Description = styled(Typography)({
  fontSize: '15px',
  color: '#666',
  lineHeight: 1.7,
  marginBottom: '30px',
  maxWidth: '90%',
});

const StyledButton = styled('a')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: primaryColor,
  color: '#fff',
  padding: '10px 24px',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  textDecoration: 'none',
  borderRadius: '25px',
  transition: 'all 0.3s ease',
  border: 'none',
  '& svg': {
    fontSize: '18px',
    color: '#fff',
  },
  '&:hover': {
    backgroundColor: '#ff5252',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(255,107,107,0.3)',
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
  borderRadius: '10px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: primaryColor,
    boxShadow: '0 5px 20px rgba(255,107,107,0.1)',
  },
});

const AccordionButton = styled('div')({
  padding: '18px 25px',
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
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: iconColor,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '28px',
  },
  '& .arrow': {
    position: 'absolute',
    right: '25px',
    fontSize: '12px',
    color: '#999',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: lightBg,
  },
});

const AccordionContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen'
})(({ isOpen }) => ({
  maxHeight: isOpen ? '200px' : '0',
  opacity: isOpen ? 1 : 0,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  backgroundColor: iconColor,
  borderTop: isOpen ? `1px solid ${borderColor}` : 'none',
}));

const ContentInner = styled(Box)({
  padding: '20px 25px',
  '& p': {
    fontSize: '14px',
    color: '#fff',
    lineHeight: 1.7,
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
        <Grid container spacing={6} alignItems="flex-start">
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionHeaderWrapper>
              <HeaderTopRow>
                <SectionIconWrapper>
                  <PetsIcon sx={{ color: '#fff', fontSize: 18 }} />
                </SectionIconWrapper>
                <SectionSubtitle>
                  General & Popular
                </SectionSubtitle>
              </HeaderTopRow>
              <SectionTitle>
                Frequently asked questions
              </SectionTitle>
            </SectionHeaderWrapper>
            <Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit lobortis sapien.
            </Description>
            <StyledButton href="#">
              <PetsIcon sx={{ fontSize: 16 }} />
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
                      fontSize: 12,
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