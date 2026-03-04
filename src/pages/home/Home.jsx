// Home.jsx
import React from 'react';
import Services from './Services';
import HeroServiceSection from '../../components/shared/HeroServiceSection';
import WhyChooseSectionComponent from '../../components/shared/WhyChooseSectionComponent';
import Adoption from './Adoption';
import Banner from './Banner';

const Home = () => {
    return (
        <>
            <Banner />
            <HeroServiceSection />
            <Services />
            <WhyChooseSectionComponent />
            <Adoption />
        </>
    );
};

export default Home;