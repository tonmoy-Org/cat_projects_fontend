// Home.jsx
import React from 'react';
import Services from './Services';
import HeroServiceSection from '../../components/shared/HeroServiceSection';
import WhyChooseSectionComponent from '../../components/shared/WhyChooseSectionComponent';
import Adoption from './Adoption';
import Banner from './Banner';
import FeaturedProducts from './FeaturedProducts';
import FAQ from '../faq/faq';
import BlogArticles from './BlogArticles';

const Home = () => {
    return (
        <>
            <Banner />
            <HeroServiceSection />
            <Services />
            <WhyChooseSectionComponent />
            <Adoption />
            <FeaturedProducts />
            <FAQ />
            <BlogArticles />
        </>
    );
};

export default Home;