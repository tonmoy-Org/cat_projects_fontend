// Cookies.jsx
import React from 'react';
import {
  Container,
  Box,
  Typography,
  styled,
} from '@mui/material';

// Simple color scheme
const colors = {
  primary: '#ff6b6b',
  dark: '#333333',
  light: '#f9f9f9',
  white: '#ffffff',
  gray: '#666666',
};

// Styled Components
const PageContainer = styled(Box)({
  backgroundColor: colors.white,
  minHeight: '100vh',
  padding: '40px 0',
  width: '100%',
});

const MainTitle = styled(Typography)({
  fontSize: '32px',
  fontWeight: 700,
  color: colors.primary,
  textAlign: 'center',
  marginBottom: '40px',
  '@media (max-width: 600px)': {
    fontSize: '36px',
  },
});

const SubTitle = styled(Typography)({
  fontSize: '24px', // Reduced from 30px
  fontWeight: 700,
  color: colors.primary,
  paddingBottom: '20px',
});

const Paragraph = styled(Typography)({
  fontSize: '14px', // Reduced from 16px
  color: colors.gray,
  lineHeight: 1.6, // Adjusted from 1.8
  marginBottom: '20px', // Reduced from 25px
  width: '100%',
});

const Cookies = () => {
  return (
    <PageContainer>
      <Container maxWidth="lg">
        <MainTitle>Cookies Policy</MainTitle>

        <SubTitle>Cookies Policy</SubTitle>

        <Paragraph>
          Thank you for visiting <strong>Father of Maw</strong>. This Cookies Policy explains how we use cookies and similar technologies on our website. By continuing to use our site, you consent to our use of cookies as described in this policy.
        </Paragraph>

        <Paragraph>
          We want your experience on our website to be as smooth and personalized as possible. Cookies help us achieve that by remembering your preferences and understanding how you interact with our site. If you have any questions about our cookies policy, please contact us at privacy@fatherofmaw.com.
        </Paragraph>

        <Paragraph>
          <strong>1. What Are Cookies?</strong> Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to the website owners. Cookies don't harm your device and don't contain viruses.
        </Paragraph>

        <Paragraph>
          <strong>2. How We Use Cookies:</strong> We use cookies for several purposes:
        </Paragraph>

        <Paragraph sx={{ pl: 4 }}>
          2.1 <strong>Essential Cookies:</strong> These are necessary for our website to function properly. They enable you to navigate the site and use its features, such as accessing secure areas and booking our pet care services.
        </Paragraph>

        <Paragraph sx={{ pl: 4 }}>
          2.2 <strong>Preference Cookies:</strong> These remember your choices and preferences, such as your language selection or saved login details, to make your experience more convenient and personalized.
        </Paragraph>

        <Paragraph sx={{ pl: 4 }}>
          2.3 <strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website by collecting information about which pages are visited most often, how users navigate the site, and if they encounter any errors. This helps us improve our website and services.
        </Paragraph>

        <Paragraph sx={{ pl: 4 }}>
          2.4 <strong>Marketing Cookies:</strong> These are used to deliver relevant advertisements to you and measure the effectiveness of our marketing campaigns. They may track your browsing habits across different websites.
        </Paragraph>

        <Paragraph>
          <strong>3. Types of Cookies We Use:</strong> Some cookies are "session cookies" that are deleted when you close your browser, while others are "persistent cookies" that remain on your device for a set period or until you delete them.
        </Paragraph>

        <Paragraph>
          <strong>4. Third-Party Cookies:</strong> We may also use cookies from trusted third parties for analytics and marketing purposes. For example, we use Google Analytics to understand how visitors use our site. These third parties have their own privacy and cookies policies.
        </Paragraph>

        <Paragraph>
          <strong>5. Your Control Over Cookies:</strong> You have the right to choose whether to accept cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. However, please note that disabling cookies may affect your ability to use certain features of our website, such as booking services or accessing your account.
        </Paragraph>

        <Paragraph>
          <strong>6. How to Manage Cookies:</strong> You can manage cookies through your browser settings:
        </Paragraph>

        <Paragraph sx={{ pl: 4 }}>
          6.1 <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
        </Paragraph>
        <Paragraph sx={{ pl: 4 }}>
          6.2 <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
        </Paragraph>
        <Paragraph sx={{ pl: 4 }}>
          6.3 <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
        </Paragraph>
        <Paragraph sx={{ pl: 4 }}>
          6.4 <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
        </Paragraph>

        <Paragraph>
          <strong>7. Changes to This Cookies Policy:</strong> We may update this Cookies Policy from time to time to reflect changes in our practices or for legal reasons. Any updates will be posted on this page with an updated revision date. We encourage you to check this page periodically for any changes.
        </Paragraph>

        <Paragraph>
          <strong>8. Consent:</strong> By continuing to use our website, you consent to our use of cookies as described in this policy. If you do not agree to our use of cookies, you should adjust your browser settings accordingly or refrain from using our site.
        </Paragraph>

        <Paragraph>
          <strong>9. Contact Us:</strong> If you have any questions or concerns about our use of cookies, please contact us at privacy@fatherofmaw.com, call us at +1 (234) 567-8910, or visit us at 0665 Broadway St, New York, NY 10234.
        </Paragraph>
      </Container>
    </PageContainer>
  );
};

export default Cookies;