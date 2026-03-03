// Home.jsx
import React from 'react';
import Services from './Services'; // Adjust path as needed
import HeroServiceSection from '../../components/shared/HeroServiceSection';
import WhyChooseSectionComponent from '../../components/shared/WhyChooseSectionComponent';
import TeamSectionComponent from '../../components/shared/TeamSectionComponent';
import Adoption from './Adoption';
import Testimonials from './Testimonials';

const Home = () => {
    return (
        <>
            <HeroServiceSection />
            <Services />
            <WhyChooseSectionComponent />
            <Adoption />
            <TeamSectionComponent />
            <Testimonials />

        </>
    );
};

export default Home;