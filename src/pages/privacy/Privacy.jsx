// Privacy.jsx
import React from 'react';
import {
  Container,
  Box,
  Typography,
  styled,
} from '@mui/material';
import { Title } from '@mui/icons-material';

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
  fontSize: '48px',
  fontWeight: 700,
  color: colors.primary,
  textAlign: 'center',
  marginBottom: '40px',
  '@media (max-width: 600px)': {
    fontSize: '36px',
  },
});
const SubTitle = styled(Typography)({
  fontSize: '30px',
  fontWeight: 700,
  color: 'primary',
  paddingBottom: '20px',
});

const Paragraph = styled(Typography)({
  fontSize: '16px',
  color: colors.gray,
  lineHeight: 1.8,
  marginBottom: '25px',
  width: '100%',
});

const Privacy = () => {
  return (
    <PageContainer>
      <Container maxWidth="lg">
        <MainTitle>Privacy Policy</MainTitle>

        <SubTitle> Privacy Policy</SubTitle>

        <Paragraph>
          Thank you for joining the <strong>Father of Maw</strong> family. We are committed to protecting your personal information and privacy. If you have any questions about our privacy policy, please contact us at privacy@fatherofmaw.com.
        </Paragraph>

        <Paragraph>
          We believe that whenever you use our website or services, you trust us with your information and privacy. Your personal information and privacy are extremely important to us. Through this policy, we want to clearly explain what information we collect, how we use it, and what rights you have regarding your data.
        </Paragraph>

        <Paragraph>
          We hope you will read the following policy carefully. It is very important for you. If there is anything you disagree with or find concerning, please contact us immediately. We also request that you read this policy attentively, as it will give you a clear understanding of our practices.
        </Paragraph>

        <Paragraph>
          <strong>What Information We Collect:</strong> When you register on our website, participate in our forums and activities, or contact us, you voluntarily provide us with certain personal information. We collect this information to help us know you better and provide our pet care services. This may include your name, phone number, email address, home address, and password. We also collect payment information needed to process your purchases, which is handled securely through third-party providers.
        </Paragraph>

        <Paragraph>
          <strong>Pet Information:</strong> We collect information about your pets including their name, breed, age, medical history, medications, dietary requirements, and special care instructions. This helps us ensure we provide the best possible care for your furry family members.
        </Paragraph>

        <Paragraph>
          <strong>Automatically Collected Information:</strong> When you visit our website, we automatically collect certain information like your IP address, device type, operating system, location, and how you interact with our site. This helps us improve our website and services.
        </Paragraph>

        <Paragraph>
          <strong>How We Use Your Information:</strong> We use your information to provide and manage our pet care services, communicate with you about appointments, process payments securely, ensure the safety of your pets, improve our website, and send promotional offers (you can opt out anytime).
        </Paragraph>

        <Paragraph>
          <strong>Cookies:</strong> Yes, we use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us remember your preferences. You can disable cookies through your browser settings, but this may affect some features of our website.
        </Paragraph>

        <Paragraph>
          <strong>Information Sharing:</strong> We do not sell, trade, or rent your personal information to others. We may share information only with trusted service providers who help us operate, with veterinarians in case of emergency, or when required by law.
        </Paragraph>

        <Paragraph>
          <strong>Data Security:</strong> We implement appropriate security measures including SSL encryption, secure payment processing, regular security audits, and limited employee access to personal information to protect your data.
        </Paragraph>

        <Paragraph>
          <strong>Your Rights:</strong> You have the right to access your personal information, request corrections, request deletion, opt out of marketing communications, and export your data.
        </Paragraph>

        <Paragraph>
          <strong>Children's Privacy:</strong> Our services are intended for adults. We do not knowingly collect information from children under 13. If you believe a child has provided us with information, please contact us immediately.
        </Paragraph>

        <Paragraph>
          <strong>Policy Updates:</strong> We may update this privacy policy periodically to comply with relevant laws and regulations. Changes will be posted on this page with an updated revision date.
        </Paragraph>

        <Paragraph>
          <strong>Contact Us:</strong> If you have any questions or comments about this policy, please contact us at privacy@fatherofmaw.com, call us at +1 (234) 567-8910, or visit us at 0665 Broadway St, New York, NY 10234.
        </Paragraph>

        <Paragraph sx={{ textAlign: 'center', mt: 5, color: colors.primary, fontWeight: 600 }}>
          Thank you for being part of the Father of Maw family!
        </Paragraph>

        <Paragraph sx={{ textAlign: 'center', color: colors.gray }}>
          Team Father of Maw
        </Paragraph>

        <Paragraph sx={{ textAlign: 'center', fontSize: '14px', color: colors.gray, mt: 4 }}>
          © {new Date().getFullYear()} Father of Maw. All rights reserved.
        </Paragraph>
      </Container>
    </PageContainer>
  );
};

export default Privacy;