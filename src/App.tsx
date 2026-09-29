import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ProjectsOverviewPage } from './pages/ProjectsOverviewPage.tsx';
import { CategoryHubPage } from './pages/CategoryHubPage.tsx';
import { FlooringCalculatorPage } from './pages/FlooringCalculatorPage.tsx';
import { TileCalculatorPage } from './pages/TileCalculatorPage.tsx';
import { PaintCalculatorPage } from './pages/PaintCalculatorPage.tsx';
import { MulchCalculatorPage } from './pages/MulchCalculatorPage.tsx';
import { ConcreteSlabCalculatorPage } from './pages/ConcreteSlabCalculatorPage.tsx';
import { ConcretePostHoleCalculatorPage } from './pages/ConcretePostHoleCalculatorPage.tsx';
import { GravelCalculatorPage } from './pages/GravelCalculatorPage.tsx';
import { SodCalculatorPage } from './pages/SodCalculatorPage.tsx';
import { DrywallCalculatorPage } from './pages/DrywallCalculatorPage.tsx';
import { DeckMaterialCalculatorPage } from './pages/DeckMaterialCalculatorPage.tsx';
import { FenceMaterialCalculatorPage } from './pages/FenceMaterialCalculatorPage.tsx';
import { RoofingCalculatorPage } from './pages/RoofingCalculatorPage.tsx';
import { PaverPatioCalculatorPage } from './pages/PaverPatioCalculatorPage.tsx';
import { TopsoilCalculatorPage } from './pages/TopsoilCalculatorPage.tsx';
import { BaseboardTrimCalculatorPage } from './pages/BaseboardTrimCalculatorPage.tsx';
import { GuidePage } from './pages/GuidePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { MethodologyPage } from './pages/MethodologyPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { CALCULATORS } from './data/calculators.ts';
import { CATEGORIES, getCategoryBySlug, getCategoryByHubPath } from './data/categories.ts';
import { getGuideBySlug } from './data/guides.ts';
import { SITE_CONFIG, getCanonicalUrl } from './data/siteConfig.ts';
import { initGA, trackPageView, trackCategoryView } from './lib/analytics.ts';
import { CalculatorTrackerWrapper } from './components/calculator/CalculatorTrackerWrapper.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Browser-safe GA4 initialization on mount
  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize dynamic SEO metadata (Title, Meta description, Canonical, OpenGraph, JSON-LD)
  useEffect(() => {
    let cleanPath = currentPath.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';

    // Canonical category redirect: /categories/:slug -> /projects/:slug
    if (cleanPath.startsWith('/categories/')) {
      const slug = cleanPath.replace(/^\/categories\//, '');
      const cat = getCategoryBySlug(slug) || getCategoryByHubPath(cleanPath);
      if (cat) {
        const canonicalCatPath = `/projects/${cat.slug}`;
        window.history.replaceState({}, '', canonicalCatPath);
        setCurrentPath(canonicalCatPath);
        cleanPath = canonicalCatPath;
      }
    } else if (cleanPath === '/calculators/flooring') {
      const canonicalFlooringPath = '/calculators/flooring-calculator';
      window.history.replaceState({}, '', canonicalFlooringPath);
      setCurrentPath(canonicalFlooringPath);
      cleanPath = canonicalFlooringPath;
    }

    const canonicalUrl = getCanonicalUrl(cleanPath);

    const matchCalc = cleanPath.match(/^\/calculators\/([a-z0-9-]+)$/);
    const calcKey = matchCalc ? matchCalc[1] : null;
    const calc = calcKey ? CALCULATORS[calcKey] : null;

    const matchProject = cleanPath.match(/^\/projects\/([a-z0-9-]+)$/);
    const cat = matchProject ? (getCategoryBySlug(matchProject[1]) || getCategoryByHubPath(cleanPath)) : null;

    const matchGuide = cleanPath.match(/^\/guides\/([a-z0-9-]+)$/);
    const guideSlug = matchGuide ? matchGuide[1] : null;
    const guideObj = guideSlug ? (getGuideBySlug(guideSlug) || null) : null;

    let isNotFound = false;
    let pageTitle = `${SITE_CONFIG.siteName} | Plan your project. Estimate materials. Understand the cost.`;
    let metaDesc = SITE_CONFIG.defaultDescription;
    let schemaData: Record<string, unknown> | null = null;

    const breadcrumbItems: { name: string; item: string }[] = [
      { name: 'Home', item: getCanonicalUrl('/') },
    ];

    if (calc) {
      pageTitle = `${calc.seo.metaTitle} | ${SITE_CONFIG.siteName}`;
      metaDesc = calc.seo.metaDescription;
      schemaData = {
        '@type': 'SoftwareApplication',
        name: calc.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        description: calc.description,
        url: canonicalUrl,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      };

      const calcCat = CATEGORIES[calc.categoryId];
      breadcrumbItems.push({ name: 'Projects', item: getCanonicalUrl('/projects') });
      if (calcCat) {
        breadcrumbItems.push({ name: calcCat.name, item: getCanonicalUrl(`/projects/${calcCat.slug}`) });
      }
      breadcrumbItems.push({ name: calc.name, item: canonicalUrl });
    } else if (matchProject && cat) {
      pageTitle = `${cat.seo.metaTitle} | ${SITE_CONFIG.siteName}`;
      metaDesc = cat.seo.metaDescription;
      schemaData = {
        '@type': 'CollectionPage',
        name: `${cat.name} Project Tools`,
        url: canonicalUrl,
        description: metaDesc,
      };
      breadcrumbItems.push({ name: 'Projects', item: getCanonicalUrl('/projects') });
      breadcrumbItems.push({ name: cat.name, item: canonicalUrl });
    } else if (matchGuide && guideObj) {
      pageTitle = `${guideObj.metaTitle} | ${SITE_CONFIG.siteName}`;
      metaDesc = guideObj.metaDescription;
      schemaData = {
        '@type': 'Article',
        headline: guideObj.title,
        description: guideObj.metaDescription,
        datePublished: guideObj.publishedDate,
        dateModified: guideObj.lastReviewedDate,
        url: canonicalUrl,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        author: SITE_CONFIG.editorialTeam,
        publisher: SITE_CONFIG.organization,
      };

      const guideCat = CATEGORIES[guideObj.categoryId];
      breadcrumbItems.push({ name: 'Projects', item: getCanonicalUrl('/projects') });
      if (guideCat) {
        breadcrumbItems.push({ name: guideCat.name, item: getCanonicalUrl(`/projects/${guideCat.slug}`) });
      }
      breadcrumbItems.push({ name: guideObj.title, item: canonicalUrl });
    } else if (cleanPath === '/projects') {
      pageTitle = `Browse Home Projects & Estimating Tools | ${SITE_CONFIG.siteName}`;
      metaDesc =
        'Browse 7 residential project categories and 15 interactive material estimating worksheets. Calculate flooring, paint, concrete, mulch, drywall, decking, and roofing.';
      schemaData = {
        '@type': 'CollectionPage',
        name: 'Browse Home Projects',
        url: canonicalUrl,
        description: metaDesc,
      };
      breadcrumbItems.push({ name: 'Projects', item: canonicalUrl });
    } else if (cleanPath === '/') {
      pageTitle = `${SITE_CONFIG.siteName} | Plan your project. Estimate materials. Understand the cost.`;
      metaDesc = SITE_CONFIG.defaultDescription;
      schemaData = {
        '@type': 'WebSite',
        name: SITE_CONFIG.siteName,
        url: canonicalUrl,
        description: metaDesc,
      };
    } else if (cleanPath === '/about') {
      pageTitle = `About Us | ${SITE_CONFIG.siteName}`;
      metaDesc =
        'Learn about Home Project Planner, our three-stage material estimating model, planning cost benchmarks, and transparent residential project planning mission.';
      schemaData = {
        '@type': 'AboutPage',
        name: `About ${SITE_CONFIG.siteName}`,
        url: canonicalUrl,
        description: metaDesc,
      };
      breadcrumbItems.push({ name: 'About', item: canonicalUrl });
    } else if (cleanPath === '/methodology') {
      pageTitle = `Calculation Methodology & Estimating Standards | ${SITE_CONFIG.siteName}`;
      metaDesc =
        'Detailed explanation of how Home Project Planner calculates material requirements, cut waste allowances, commercial package rounding, and planning costs.';
      schemaData = {
        '@type': 'WebPage',
        name: `Calculation Methodology - ${SITE_CONFIG.siteName}`,
        url: canonicalUrl,
        description: metaDesc,
      };
      breadcrumbItems.push({ name: 'About', item: getCanonicalUrl('/about') });
      breadcrumbItems.push({ name: 'Methodology', item: canonicalUrl });
    } else if (cleanPath === '/contact') {
      pageTitle = `Contact & Feedback | ${SITE_CONFIG.siteName}`;
      metaDesc =
        'Report calculation discrepancies, errata, broken links, or suggest new home improvement packaging benchmarks to Home Project Planner.';
      schemaData = {
        '@type': 'ContactPage',
        name: `Contact ${SITE_CONFIG.siteName}`,
        url: canonicalUrl,
        description: metaDesc,
      };
      breadcrumbItems.push({ name: 'Contact', item: canonicalUrl });
    } else if (cleanPath === '/privacy') {
      pageTitle = `Privacy Policy | ${SITE_CONFIG.siteName}`;
      metaDesc =
        'Home Project Planner privacy policy: 100% client-side calculation processing, no advertising trackers, and aggregate analytics disclosures.';
      schemaData = {
        '@type': 'WebPage',
        name: `Privacy Policy - ${SITE_CONFIG.siteName}`,
        url: canonicalUrl,
        description: metaDesc,
      };
      breadcrumbItems.push({ name: 'Privacy Policy', item: canonicalUrl });
    } else if (cleanPath === '/terms') {
      pageTitle = `Terms of Use & Disclaimers | ${SITE_CONFIG.siteName}`;
      metaDesc =
        'Terms of use and disclaimers for Home Project Planner: informational planning tools, user verification responsibilities, and limitation of liability.';
      schemaData = {
        '@type': 'WebPage',
        name: `Terms of Use - ${SITE_CONFIG.siteName}`,
        url: canonicalUrl,
        description: metaDesc,
      };
      breadcrumbItems.push({ name: 'Terms of Use', item: canonicalUrl });
    } else {
      isNotFound = true;
      pageTitle = `Page Not Found | ${SITE_CONFIG.siteName}`;
      metaDesc =
        'The requested page could not be found. Return to Home Project Planner to plan your residential project and estimate materials.';
      schemaData = null;
    }

    document.title = pageTitle;

    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMetaTag('meta[name="description"]', 'name', 'description', metaDesc);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDesc);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', guideObj ? 'article' : 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_CONFIG.siteName);
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDesc);

    if (isNotFound) {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Structured Data JSON-LD graph assembly
    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement | null;
    if (isNotFound || !schemaData) {
      if (scriptTag) {
        scriptTag.remove();
      }
    } else {
      const jsonLdGraph: Record<string, unknown>[] = [schemaData];

      if (breadcrumbItems.length > 1) {
        jsonLdGraph.push({
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: b.name,
            item: b.item,
          })),
        });
      }

      if (guideObj && guideObj.faqs && guideObj.faqs.length > 0) {
        jsonLdGraph.push({
          '@type': 'FAQPage',
          mainEntity: guideObj.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        });
      }

      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'schema-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': jsonLdGraph,
      });
    }

    // Client-side SPA Page View Tracking
    trackPageView({
      page_path: cleanPath,
      page_title: pageTitle,
      page_location: canonicalUrl,
    });

    // Optional category view tracking for category hubs
    if (cat) {
      trackCategoryView({
        category_slug: cat.slug,
      });
    }
  }, [currentPath]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route matching
  const renderContent = () => {
    const cleanPath = currentPath.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';

    // 1. Calculator Routes (wrapped with unified analytics interaction & completion tracker)
    if (cleanPath === '/calculators/tile-calculator') {
      const meta = CALCULATORS['tile-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="tile-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <TileCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/paint-calculator') {
      const meta = CALCULATORS['paint-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="paint-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <PaintCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/mulch-calculator') {
      const meta = CALCULATORS['mulch-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="mulch-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <MulchCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/concrete-slab-calculator') {
      const meta = CALCULATORS['concrete-slab-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="concrete-slab-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <ConcreteSlabCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/concrete-post-hole-calculator') {
      const meta = CALCULATORS['concrete-post-hole-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="concrete-post-hole-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <ConcretePostHoleCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/gravel-calculator') {
      const meta = CALCULATORS['gravel-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="gravel-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <GravelCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/sod-calculator') {
      const meta = CALCULATORS['sod-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="sod-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <SodCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/drywall-calculator') {
      const meta = CALCULATORS['drywall-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="drywall-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <DrywallCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/deck-material-calculator') {
      const meta = CALCULATORS['deck-material-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="deck-material-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <DeckMaterialCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/fence-material-calculator') {
      const meta = CALCULATORS['fence-material-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="fence-material-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <FenceMaterialCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/roofing-calculator') {
      const meta = CALCULATORS['roofing-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="roofing-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <RoofingCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/paver-patio-calculator') {
      const meta = CALCULATORS['paver-patio-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="paver-patio-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <PaverPatioCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/topsoil-calculator') {
      const meta = CALCULATORS['topsoil-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="topsoil-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <TopsoilCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (cleanPath === '/calculators/baseboard-trim-calculator') {
      const meta = CALCULATORS['baseboard-trim-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="baseboard-trim-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <BaseboardTrimCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }
    if (
      cleanPath === '/calculators/flooring-calculator' ||
      cleanPath === '/calculators/flooring'
    ) {
      const meta = CALCULATORS['flooring-calculator'];
      return (
        <CalculatorTrackerWrapper
          calculatorSlug="flooring-calculator"
          calculatorName={meta.name}
          projectCategory={meta.categoryId}
        >
          <FlooringCalculatorPage onNavigate={navigate} />
        </CalculatorTrackerWrapper>
      );
    }

    // 2. Category Hub Routes (/projects/:slug or /categories/:slug)
    if (cleanPath.startsWith('/projects/') || cleanPath.startsWith('/categories/')) {
      const slug = cleanPath.replace(/^\/(projects|categories)\//, '');
      const category = getCategoryBySlug(slug) || getCategoryByHubPath(cleanPath);
      if (category) {
        return <CategoryHubPage category={category} onNavigate={navigate} />;
      }
    }

    // 3. Project Guide Routes (/guides/:slug)
    if (cleanPath.startsWith('/guides/')) {
      const slug = cleanPath.replace(/^\/guides\//, '');
      const guide = getGuideBySlug(slug);
      if (guide) {
        return <GuidePage guide={guide} onNavigate={navigate} />;
      }
    }

    // 4. Projects Overview Route
    if (cleanPath === '/projects') {
      return <ProjectsOverviewPage onNavigate={navigate} />;
    }

    // 5. Dedicated Homepage (Root Route /)
    if (cleanPath === '/') {
      return <HomePage onNavigate={navigate} />;
    }

    // 6. Public Trust & Foundational Pages
    if (cleanPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (cleanPath === '/methodology') {
      return <MethodologyPage onNavigate={navigate} />;
    }
    if (cleanPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (cleanPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }
    if (cleanPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }

    // Fallback: 404 Not Found Page
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5f0] text-[#1c1917] antialiased">
      <Header currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
