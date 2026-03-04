import React from 'react';
import {
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  styled,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Theme colors
const socialColor = '#ff5252';
const primaryColor = '#ff6b6b';
const grayColor = '#6c757d';

// Styled components
const TeamSection = styled(Box)({
  padding: '80px 0',
  backgroundColor: '#fff',
});

const SectionTitleWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px',
});

const SectionTitle = styled(Typography)({
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '1px',
  color: '#333',
});

const SectionIcon = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: '#db89ca',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MainTitle = styled(Typography)({
  fontSize: '36px',
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginBottom: '20px',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '32px',
  },
});

const TeamCard = styled(Card)({
  overflow: 'hidden',
  textAlign: 'center',
  position: 'relative',
  boxShadow: 'none',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  '&:hover .social-icons': {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0)',
  },
});

const TeamImageWrapper = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
});

const TeamAvatar = styled('img')({
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  borderRadius: '20px',
  transition: 'transform 0.5s ease',
});

const SocialIcons = styled(Box)({
  position: 'absolute',
  bottom: '15px',
  left: '0',
  right: '0',
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(20px)',
  transition: 'all 0.3s ease',
  zIndex: 2,
});

const SocialIcon = styled(IconButton)({
  backgroundColor: socialColor,
  color: '#fff',
  width: '35px',
  height: '35px',
  '&:hover': {
    backgroundColor: primaryColor,
    transform: 'scale(1.1)',
  },
  '& svg': {
    fontSize: '18px',
  },
});

const TeamName = styled(Typography)({
  fontSize: '18px',
  fontWeight: 600,
  color: '#1a1a1a',
  marginTop: '15px',
  marginBottom: '5px',
});

const TeamRole = styled(Typography)({
  fontSize: '14px',
  color: grayColor,
  marginBottom: '15px',
});

const TeamSectionComponent = ({
  subtitle = "Qualified Experts",
  title = "Meet our team",
  members = [
    {
      id: 1,
      name: 'Lily Brown',
      role: 'Veterinarian',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }
    },
    {
      id: 2,
      name: 'Deaner Arya',
      role: 'Training Manager',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }
    },
    {
      id: 3,
      name: 'Sophia Mia',
      role: 'Dog Trainer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80',
      social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }
    },
    {
      id: 4,
      name: 'Emily Lucas',
      role: 'Pet Groom Specialist',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
      social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }
    }
  ]
}) => {
  return (
    <TeamSection>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <SectionTitleWrapper>
            <SectionIcon>
              <PetsIcon sx={{ color: '#fff', fontSize: 30 }} />
            </SectionIcon>
            <SectionTitle>{subtitle}</SectionTitle>
          </SectionTitleWrapper>
          <MainTitle>{title}</MainTitle>
        </Box>

        <Grid container spacing={3}>
          {members.map((member) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.id}>
              <TeamCard>
                <TeamImageWrapper>
                  <TeamAvatar src={member.image} alt={member.name} />
                  <SocialIcons className="social-icons">
                    <SocialIcon component="a" href={member.social.facebook} size="small">
                      <FacebookIcon />
                    </SocialIcon>
                    <SocialIcon component="a" href={member.social.twitter} size="small">
                      <TwitterIcon />
                    </SocialIcon>
                    <SocialIcon component="a" href={member.social.instagram} size="small">
                      <InstagramIcon />
                    </SocialIcon>
                    <SocialIcon component="a" href={member.social.linkedin} size="small">
                      <LinkedInIcon />
                    </SocialIcon>
                  </SocialIcons>
                </TeamImageWrapper>
                <CardContent>
                  <TeamName>{member.name}</TeamName>
                  <TeamRole>{member.role}</TeamRole>
                </CardContent>
              </TeamCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </TeamSection>
  );
};

export default TeamSectionComponent;