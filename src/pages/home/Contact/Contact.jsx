import  { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  styled,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GradientButton from '../../../components/ui/GradientButton';

// Styled components
const ContactSection = styled(Box)({
  backgroundColor: '#ffffff',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '80px 0',
});

const ContactItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '15px',
  '&:last-child': {
    marginBottom: 0,
  }
});

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  minWidth: '40px',
  borderRadius: '50%',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: '18px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  }
}));

const ContactText = styled(Typography)({
  color: '#666',
  fontSize: '16px',
  lineHeight: 1.5,
  '& a': {
    color: '#666',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#333',
    }
  }
});

const OpeningHoursBox = styled(Box)({
  backgroundColor: '#f4f4f7',
  padding: '25px',
  borderRadius: '8px',
  marginTop: '30px',
});

const WorkTimeItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
  '&:last-child': {
    marginBottom: 0,
  }
});

const DayTitle = styled(Typography)({
  fontSize: '16px',
  color: '#333',
  fontWeight: 500,
  minWidth: '90px',
});

const Dots = styled(Box)({
  flex: 1,
  borderBottom: '1px dashed #999',
  margin: '0 15px',
});

const TimeValue = styled(Typography)({
  fontSize: '16px',
  color: '#666',
});

const SectionTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  color: '#333',
  marginBottom: '25px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '50px',
    height: '3px',
    backgroundColor: (theme) => theme.palette.primary.main,
  }
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#ccc',
    },
    '&.Mui-focused fieldset': {
      borderColor: (theme) => theme.palette.primary.main,
    }
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
    fontSize: '14px',
  },
});

const LeftColumnWrapper = styled(Box)({
  paddingRight: '30px',
});

const services = [
  { value: 'Dog walking', label: 'Dog walking' },
  { value: 'Puppy program', label: 'Puppy program' },
  { value: 'Training services', label: 'Training services' },
  { value: 'Overnight care', label: 'Overnight care' },
  { value: 'Pet grooming', label: 'Pet grooming' },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    subject: '',
    message: '',
    consultation: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <ContactSection>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={7}
          justifyContent="center"
        >
          {/* Left Column - Location & Opening hours */}
          <Grid size={{ xs: 12, md: 5 }}>
            <LeftColumnWrapper>
              <SectionTitle variant="h5">Location</SectionTitle>

              <ContactItem>
                <IconWrapper>
                  <LocationOnIcon sx={{ fontSize: '20px' }} />
                </IconWrapper>
                <ContactText>0665 Broadway st. 10234 NY, USA</ContactText>
              </ContactItem>

              <ContactItem>
                <IconWrapper>
                  <PhoneIcon sx={{ fontSize: '20px' }} />
                </IconWrapper>
                <ContactText>
                  <a href="tel:+1-234-567-8910">+1 234 567 8910</a>
                </ContactText>
              </ContactItem>

              <ContactItem>
                <IconWrapper>
                  <EmailIcon sx={{ fontSize: '20px' }} />
                </IconWrapper>
                <ContactText>
                  <a href="mailto:hello@Pepito.com">hello@Pepito.com</a>
                </ContactText>
              </ContactItem>

              {/* Opening hours with background color */}
              <OpeningHoursBox>
                <SectionTitle
                  variant="h5"
                  sx={{
                    marginBottom: '20px',
                    '&::after': {
                      bottom: '-8px',
                    }
                  }}
                >
                  Opening hours
                </SectionTitle>

                <WorkTimeItem>
                  <DayTitle>Mon - Fri</DayTitle>
                  <Dots />
                  <TimeValue>8.00 am - 8.00 pm</TimeValue>
                </WorkTimeItem>

                <WorkTimeItem>
                  <DayTitle>Saturday</DayTitle>
                  <Dots />
                  <TimeValue>9.00 am - 6.00 pm</TimeValue>
                </WorkTimeItem>


                <WorkTimeItem>
                  <DayTitle>Sunday</DayTitle>
                  <Dots />
                  <TimeValue sx={{ color: '#999' }}>Closed</TimeValue>
                </WorkTimeItem>
              </OpeningHoursBox>
            </LeftColumnWrapper>
          </Grid>

          {/* Right Column - Get in touch Form */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <SectionTitle variant="h5">Get in touch</SectionTitle>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <StyledTextField
                      fullWidth
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <StyledTextField
                      fullWidth
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <StyledTextField
                      fullWidth
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <StyledTextField
                      fullWidth
                      name="service"
                      select
                      placeholder="Select Service"
                      value={formData.service}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      SelectProps={{
                        displayEmpty: true,
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Service
                      </MenuItem>
                      {services.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <StyledTextField
                      fullWidth
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <StyledTextField
                      fullWidth
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="consultation"
                          checked={formData.consultation}
                          onChange={handleChange}
                          sx={{
                            color: '#ccc',
                            padding: '4px',
                            '&.Mui-checked': {
                              color: (theme) => theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#666', fontSize: '14px' }}>
                          Schedule a free health consultation
                        </Typography>
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                    <GradientButton
                      type="submit"
                      variant="contained"
                      startIcon={<CalendarTodayIcon />}
                      sx={{ borderRadius: '30px', py: 1, px: 3 }}
                    >
                      Make Appointment
                    </GradientButton>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ContactSection>
  );
};

export default Contact;