// Home.jsx
import React from 'react';
import Services from './Services'; // Adjust path as needed
import HeroServiceSection from '../../components/shared/HeroServiceSection';
import WhyChooseSectionComponent from '../../components/shared/WhyChooseSectionComponent';
import TeamSectionComponent from '../../components/shared/TeamSectionComponent';
import Adoption from './Adoption';
import Testimonials from './Testimonials';
import FeaturedProducts from './FeaturedProducts';
import FAQ from '../faq/faq';
import BlogArticles from './BlogArticles';

const Home = () => {
    return (
        <>
            <HeroServiceSection />
            <Services />
            <WhyChooseSectionComponent />
            <Adoption />
            <TeamSectionComponent />
            <Testimonials />
            <FeaturedProducts />
            <FAQ />
            <BlogArticles />

        </>
    );
};

export default Home;