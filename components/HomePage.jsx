'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Catalog, { useCatalog } from './Catalog';
import { useSupport } from './SupportWidget';
import { copy, pathFor } from '../lib/site';
import { centralUrl, durationText, message } from '../lib/api';
import VerifiedReviews from './VerifiedReviews';

function ScreenArtwork() {
  return <div className="get-stage" aria-hidden="true">
    <span className="stage-halo" /><span className="stage-grid" />
    <div className="stage-screen"><div className="stage-screen-top"><span className="stage-brand">GET<span>IPTV</span></span><span className="stage-menu"><i /><i /><i /></span></div>
      <div className="stage-feature"><span className="stage-feature-orbit" /><span className="stage-feature-sphere" /><span className="stage-feature-word">GET<br />INTO IT.</span><span className="stage-play">▶</span></div>
      <div className="stage-tiles"><span /><span /><span /><span /></div>
    </div>
    <div className="stage-phone"><span className="phone-speaker" /><span className="phone-orbit" /><span className="phone-play">▶</span><div><i /><i /><i /></div></div>
    <span className="stage-remote"><i /><i /><i /><i /><i /><i /></span>
    <span className="stage-reflection" />
  </div>;
}

export function SupportSection({ site, text = {}, labels = {} }) {
  const { openContact } = useSupport();
  const [origin, setOrigin] = useState('https://opplexiptv.com');
  const { data } = useCatalog();
  const t = value => copy(value, text);
  useEffect(() => { setOrigin(new URL(centralUrl('/contact', site.source)).origin); }, [site.source]);
  return <section id="support" className="support-section container" aria-labelledby="support-heading"><div className="support-card">
    <div><p className="eyebrow">{t('A little help goes a long way')}</p><h2 id="support-heading">{t('Get clear answers.')}</h2><p>{t('Tell support about your screen, player and selected plan. Start with the question that matters to you.')}</p></div>
    <div className="support-actions"><button type="button" className="button button-primary" onClick={event => openContact('whatsapp', event.currentTarget)}>{labels.contact || t('Contact support')}<span aria-hidden="true">↗</span></button>
      {data?.support?.email && <a className="support-detail" href={'mailto:' + data.support.email}>{data.support.email}</a>}
      {data?.support?.phone && <a className="support-detail" href={'tel:+' + data.support.phone.replace(/\D/g, '')}>{data.support.phone_display || data.support.phone}</a>}
      <a className="support-main-link" href={centralUrl('/contact', site.source, origin)}>{t("Or use the main website's contact page")}</a>
    </div>
  </div></section>;
}

export default function HomePage({ site, locale, ui = {}, text = {}, labels = {}, nav = {}, pages = [] }) {
  const { data, loading, devices, deviceError } = useCatalog();
  const t = value => copy(value, text);
  const content = data?.content || {};
  const guides = content.guide_sections || [];
  const faqs = content.faqs || [];
  const articles = pages.filter(page => page.kind === 'article');
  const firstPlan = data?.packages?.[0];
  const experienceUi = data?.experience?.ui || {};

  return <main id="main" className="home-page home-getiptv">
    <section className="hero" aria-labelledby="hero-heading"><div className="container hero-layout">
      <div className="hero-copy"><p className="eyebrow"><span aria-hidden="true" />{t('Your next screen starts here')}</p>
        <h1 id="hero-heading">{content.hero_heading || site.name}</h1><p className="hero-description">{content.hero_description}</p>
        <div className="hero-actions"><a href="#plans" className="button button-primary">{nav.packages || labels.packages}<span aria-hidden="true">↗</span></a><Link href={pathFor(locale, 'setup')} className="button button-outline">{nav.setup || labels.setup}<span aria-hidden="true">→</span></Link></div>
        <p className="hero-note">{t('Opplex and Filex plans. One clear starting point. Checkout through Opplexify via Opplex IPTV.')}</p>
      </div>
      <div className="hero-visual"><ScreenArtwork /><a className="hero-plan-preview" href="#plans"><span className="hero-preview-copy"><small>{t('From the current catalogue')}</small><strong>{firstPlan?.service || site.name}</strong></span><span className="hero-preview-price">{firstPlan?.price || (loading ? '…' : '—')}{firstPlan && <small>{durationText(firstPlan.duration_months, locale)}</small>}</span><span className="preview-arrow" aria-hidden="true">↗</span></a></div>
    </div></section>

    <div className="source-strip"><div className="container source-strip-inner"><p><span className="source-dot" aria-hidden="true" />{t('The plan is only part of the picture.')}</p><Link href={pathFor(locale, 'about')}>{nav.about}<span aria-hidden="true">↗</span></Link></div></div>

    <section className="section plans-section" id="plans" aria-labelledby="plans-heading"><div className="container plans-layout"><div className="section-heading"><div><p className="eyebrow">{t('Choose with the full picture')}</p><h2 id="plans-heading">{nav.packages || labels.packages}</h2></div><p>{t('Compare Opplex and Filex by provider, term and full price. Your exact package stays selected when you continue to checkout.')}</p></div><Catalog site={site} locale={locale} ui={ui} labels={{ retry: labels.retry }} /></div></section>

    {content.highlights?.length > 0 && <section className="highlights-section container" aria-label={nav.packages || labels.packages}><div className="highlights-grid">{content.highlights.map((item, index) => <div className="highlight-item" key={item}><span className="highlight-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{item}</p><span aria-hidden="true">↗</span></div>)}</div></section>}

    <section className="section devices-section" id="devices" aria-labelledby="devices-heading"><div className="container device-layout"><div className="devices-intro"><p className="eyebrow">{nav['iptv-applications']}</p><h2 id="devices-heading">{t('Start with your screen.')}</h2><p>{t('Have a television, streaming stick or phone in mind? Check its exact model, operating system and player app with support before you choose a plan.')}</p><Link className="text-link" href={pathFor(locale, 'iptv-applications')}>{nav['iptv-applications']}<span aria-hidden="true">↗</span></Link></div>
      <div className="devices-panel"><div className="device-drawing" aria-hidden="true"><span className="draw-monitor" /><span className="draw-tablet" /><span className="draw-phone" /></div><div className="device-list">{devices.map(device => <div className="device-item" key={device.id || device.name}><span className="device-dot" aria-hidden="true" /><span>{device.name}</span></div>)}</div>
        {deviceError && <p className="field-help" role="status">{message(ui, deviceError)}</p>}{!deviceError && !devices.length && <p role="status">{t('Loading device information…')}</p>}<p className="device-note">{t('Illustrative screens. Availability and setup requirements may vary by device and selected service.')}</p>
      </div></div></section>

    {(content.guide_heading || guides.length > 0) && <section className="section guide-section" id="guide" aria-labelledby="guide-heading"><div className="container"><div className="section-heading"><div><p className="eyebrow">{t('A better first step')}</p><h2 id="guide-heading">{content.guide_heading}</h2></div><p>{content.guide_intro}</p></div><div className="guide-grid">{guides.map((item, index) => <article className="guide-card" key={item.heading}><span className="guide-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{item.heading}</h3><p>{item.body}</p></article>)}</div></div></section>}

    {faqs.length > 0 && <section className="section faq-section" id="faq" aria-labelledby="faq-heading"><div className="container faq-layout"><div className="faq-intro"><p className="eyebrow">{t('The useful details')}</p><h2 id="faq-heading">{nav.faqs}</h2><p>{t('A few things to know before you get IPTV, from choosing a player to checking the final order.')}</p><Link className="text-link" href={pathFor(locale, 'faqs')}>{nav.faqs}<span aria-hidden="true">↗</span></Link></div><div className="faq-list">{faqs.map(item => <details className="faq-item" key={item.question}><summary>{item.question}<span className="faq-plus" aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>}

    {articles.length > 0 && <section className="section articles-section container" aria-labelledby="articles-heading"><div className="section-heading"><div><p className="eyebrow">{t('Put the pieces together')}</p><h2 id="articles-heading">{nav.blogs}</h2></div><Link className="text-link" href={pathFor(locale, 'blogs')}>{labels.readMore}<span aria-hidden="true">↗</span></Link></div><div className="article-grid">{articles.map((article, index) => <article className="article-card" key={article.slug}><span className="article-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3><Link href={pathFor(locale, article.slug)}>{article.title}</Link></h3><p>{article.description}</p><Link className="text-link" href={pathFor(locale, article.slug)}>{labels.readMore}<span aria-hidden="true">→</span></Link></article>)}</div></section>}

    {experienceUi.toolsHeading && <section className="section experience-intro container" aria-labelledby="customer-help-heading"><p className="eyebrow">{site.name}</p><h2 id="customer-help-heading">{experienceUi.toolsHeading}</h2><p>{experienceUi.toolsIntro}</p><div className="experience-actions"><Link className="button button-secondary" href={pathFor(locale, 'setup') + '#help-assistant'}>{experienceUi.openHelp}<span aria-hidden="true">→</span></Link><Link className="text-link" href={pathFor(locale, 'contact') + '#service-status'}>{experienceUi.statusHeading}<span aria-hidden="true">→</span></Link></div><VerifiedReviews locale={locale} /></section>}
    <SupportSection site={site} locale={locale} labels={labels} text={text} />
  </main>;
}
